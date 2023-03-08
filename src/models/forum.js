const mongoose = require('mongoose');


const ForumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    category: {
        type: String,
        enum: ['job', 'resources', 'resume', 'general'],
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

module.exports = mongoose.model('ForumPost', ForumPostSchema);