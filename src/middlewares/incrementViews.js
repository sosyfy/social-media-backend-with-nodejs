// Middleware to increment views for forum post if first visit 

const ForumPost = require('#/models/forum');

exports.incrementForumPostViews = async (req, res, next) => {
    const { id } = req.params;
    try {
        const forumPost = await ForumPost.findById(id);
        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found.' });
        }
        const ipAddress = req.ip;
        if (!forumPost.visitedBy.includes(ipAddress)) {
            await ForumPost.findByIdAndUpdate(id, { $inc: { views: 1 }, $push: { visitedBy: ipAddress } });
        }
        next();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
