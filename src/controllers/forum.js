const ForumPost = require('#models/forum')
const User = require('#models/user');
const getWeightedRecommendations = require('../lib/forum-post-recommendations');
// Create forum post 

exports.createForumPost = async (req, res) => {
    const { title, description, category } = req.body;
    const creator = req.user.id;
    try {
        const user = await User.findById(req.user.id);
        const userInfo = user.userInfo;
        const forumPost = await ForumPost.create({ title, userInfo, creator, description, category });
        const forumPosts = await ForumPost.find({ category }).sort({ createdAt: -1 }).populate("userInfo")
        res.status(201).json(forumPosts);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Edit forum post 

exports.editForumPost = async (req, res) => {
    const { forumPostId } = req.params;
    const { title, description } = req.body;
    try {
        const forumPost = await ForumPost.findByIdAndUpdate(forumPostId, { title, description }, { new: true });

        res.json(forumPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Like forum post 

exports.likeForumPost = async (req, res) => {
    const { forumPostId } = req.params;
    const userId = req.user.id;
    try {
        const forumPost = await ForumPost.findById(forumPostId);
        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found.' });
        }
        let updatedForumPost;
        const alreadyLiked = forumPost.likes.includes(userId);
        if (alreadyLiked) {
            updatedForumPost = await ForumPost.findByIdAndUpdate(forumPostId, { $pull: { likes: userId } }, { new: true });
        } else {
            updatedForumPost = await ForumPost.findByIdAndUpdate(forumPostId, { $push: { likes: userId } }, { new: true });
        }

        res.json(updatedForumPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Forum posts by category
exports.getForumPostsByCategory = async (req, res) => {
    const { category } = req.params;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;
    try {
        const forumPosts = await ForumPost.find({ category })
            .populate("userInfo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json(forumPosts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Trending, most liked, latest forum posts

exports.getFilteredForumPosts = async (req, res) => {
    const { filter, category } = req.params;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;
    let sort;

    switch (filter) {
        case 'trending':
            const pastFewHours = new Date(Date.now() - 1000 * 60 * 60 * 3); // Last 3 hours
            sort = { likes: -1, createdAt: -1 };
            const trendingForumPosts = await ForumPost.find({ createdAt: { $gte: pastFewHours }, category })
                .populate("userInfo")
                .sort(sort)
                .skip(skip)
                .limit(limit);
            res.json(trendingForumPosts);
            break;

        case 'most-liked':
            sort = { likes: -1, createdAt: -1 };
            const mostLikedForumPosts = await ForumPost.find({ category })
                .populate("userInfo")
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.json(mostLikedForumPosts);
            break;

        case 'latest':
            sort = { createdAt: -1 };
            const latestForumPosts = await ForumPost.find({ category })
                .populate("userInfo")
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.json(latestForumPosts);
            break;
        default:
            res.status(400).json({ error: 'Invalid filter.' });
    }
};

// getForumPostById
exports.getForumPostById = async (req, res) => {
    const { forumPostId } = req.params;

    try {
        const ipAddress = req.ip;

        const forumPost = await ForumPost.findById(forumPostId).populate("userInfo")

        if (forumPost.visitedBy.includes(ipAddress)) {
            await ForumPost.findByIdAndUpdate(forumPostId, { $inc: { views: 1 }, $push: { visitedBy: ipAddress } });
        }

        res.json(forumPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllForumPosts = async ( req , res )=>{
    // GET all forum posts with optional filters and search
    const { category, sortBy, searchTerm } = req.query;
    if (category && !sortBy ){
        try {
            let recommendedPosts =  await getWeightedRecommendations(req.user.id , category);

            if (recommendedPosts.length < 1 ){

             recommendedPosts = await ForumPost.find({ category })
                .populate({
                  path: 'userInfo',
                })
                .sort({ viewCount: -1 });
            }
           


            res.status(200).json(recommendedPosts);

        } catch (error) {
            res.status(400).json({ error: error.message }); 
        }
    }else {      
        try {

            let filter = {};
      
            if (category) {
              filter.category = category;
            }
         
            let sortOption = { createdAt: -1 };
            if (sortBy === 'mostLiked') {
              sortOption = { likes: -1 };
            } else if (sortBy === 'mostViewed') {
              sortOption = { viewCount: -1 };
            } else if (sortBy === 'newPosts') {
              sortOption = { createdAt: -1 };
            }
        
            let searchFilter = {};
            if (searchTerm) {
              searchFilter = {
                $or: [
                  { title: { $regex: searchTerm, $options: 'i' } },
                  { description: { $regex: searchTerm, $options: 'i' } },
                ],
              };
            }
        
            const forumPosts = await ForumPost.find({ ...filter, ...searchFilter })
              .populate({
                path: 'userInfo',
              })
              .sort(sortOption);
        
            res.status(200).json(forumPosts);
          } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
          }

    }

   
 
}

