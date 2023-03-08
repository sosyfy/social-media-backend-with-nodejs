// Middleware to increment views for forum post if first visit 
const ForumPost = require('#models/forum')

  const incrementForumPostViews = async(req, res, next) => {
    const { forumPostId } = req.params;
    try {
        const forumPost = await ForumPost.findById(forumPostId);
        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found.' });
        }
        const ipAddress = req.ip;
        if (!forumPost.visitedBy.includes(ipAddress)) {
            await ForumPost.findByIdAndUpdate(forumPostId, { $inc: { views: 1 }, $push: { visitedBy: ipAddress } });
        }
        next();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports = incrementForumPostViews;