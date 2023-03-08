const mongoose = require('mongoose');


const ForumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'ForumPostComment',
    }],
    category: {
        type: String,
        enum: ['job', 'resources', 'resume building', 'general'],
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    visitedBy: [{
        type: String,
    }],
}, { timestamps: true });


const ForumPost = mongoose.model('ForumPost', ForumPostSchema);
module.exports = ForumPost;