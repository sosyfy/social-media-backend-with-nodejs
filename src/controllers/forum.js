const ForumPost = require('#/models/forum');
// Create forum post 

exports.createForumPost = async (req, res) => {
    const { title, description, category } = req.body;
    const creater = req.user.id;

    try {
        const forumPost = await ForumPost.create({ title, creater, description, category });
        res.status(201).json(forumPost);
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
                .sort(sort)
                .skip(skip)
                .limit(limit);
            res.json(trendingForumPosts);
            break;

        case 'most-liked':
            sort = { likes: -1, createdAt: -1 };
            const mostLikedForumPosts = await ForumPost.find({ category })
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.json(mostLikedForumPosts);
            break;

        case 'latest':
            sort = { createdAt: -1 };
            const latestForumPosts = await ForumPost.find({ category })
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
exports.getForumPostsByCategory = async (req, res) => {
    const { forumPostId } = req.params;

    try {
        const forumPost = await ForumPost.findById(forumPostId)
        res.json(forumPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


