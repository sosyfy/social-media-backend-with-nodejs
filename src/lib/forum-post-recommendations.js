const ForumPost = require('../models/forum');
const UserActivity = require('../models/userActivity');

// Get the activity pattern vector for a user
async function getActivityVector(userId) {
  const userActivity = await UserActivity.find({ user_id: userId }).lean();
  const activityVector = {};
  userActivity.forEach(activity => {
    if (activity.action === 'like' || activity.action === 'comment') {
      const postId = activity.post_id.toString();
      activityVector[postId] = activityVector[postId] || 0;
      activityVector[postId]++;
    }
  });
  return activityVector;
}

// Calculate the cosine similarity between two vectors
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let key in a) {
    if (b.hasOwnProperty(key)) {
      dotProduct += a[key] * b[key];
    }
    normA += a[key] ** 2;
  }
  for (let key in b) {
    normB += b[key] ** 2;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get recommendations for a user based on similar user activity patterns
async function getWeightedRecommendations(userId, limit = 100, category) {
  // Get the activity pattern vector for the target user
  const targetVector = await getActivityVector(userId);

  // Calculate the cosine similarity between the target vector and all other users
  const similarities = {};
  const userActivity = await UserActivity.find({ user_id: { $ne: userId } });
  userActivity.forEach(activity => {
    const activityVector = similarities[activity.user_id.toString()] || {};
    activityVector[activity.post_id.toString()] = activity.weight || 1;
    similarities[activity.user_id.toString()] = activityVector;
  });
  const similarUsers = [];
  for (let key in similarities) {
    const similarity = cosineSimilarity(targetVector, similarities[key]);
    if (similarity > 0) {
      similarUsers.push({ user_id: key, similarity: similarity });
    }
  }

  // Sort the similar users by cosine similarity and select the top k
  similarUsers.sort((a, b) => b.similarity - a.similarity);
  const topUsers = similarUsers.slice(0, 10).map(user => user.user_id);

  // Count the number of times each post has been interacted with by the top k similar users
  const postCounts = {};
  for (let i = 0; i < topUsers.length; i++) {
    const userActivity = await UserActivity.find({ user_id: topUsers[i] });
    userActivity.forEach(activity => {
      const postId = activity.post_id.toString();
      if (!targetVector.hasOwnProperty(postId)) {
        postCounts[postId] = postCounts[postId] || 0;
        postCounts[postId] += activity.weight || 1;
      }
    });
  }

  // Get all posts that the target user has not seen but that the top k similar users have interacted with
  const targetActivity = await UserActivity.find({ user_id: userId });
  const targetPostIds = targetActivity.map(activity => activity.post_id.toString());
  const similarPosts = [];
  for (let i = 0; i < topUsers.length; i++) {
    const userActivity = await UserActivity.find({ user_id: topUsers[i] });
    userActivity.forEach(activity => {
      const postId = activity.post_id.toString();
      if (!targetPostIds.includes(postId) && postCounts.hasOwnProperty(postId)) {
        similarPosts.push({ post_id: postId, weight: postCounts[postId] });
      }
    });
  }

  // Sort the similar posts by weight and select the top k
  similarPosts.sort((a, b) => b.weight - a.weight);
  const topPosts = similarPosts.slice(0, limit).map(post => post.post_id);

  // Get details for the recommended posts
  const recommendations = await ForumPost.find({ _id: { $in: topPosts }, category }).sort({ createdAt: -1 });

  // Record the user activity
  const newActivity = [];
  const now = new Date();
  recommendations.forEach(post => {
    newActivity.push({
      user_id: userId,
      post_id: post._id,
      action: 'recommend',
      timestamp: now
    });
  });
  await UserActivity.insertMany(newActivity);

  return recommendations;
}


module.exports = getWeightedRecommendations