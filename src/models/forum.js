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
        enum: ['job', 'resources', 'general'],
        required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    }  
  
}, { timestamps: true });

// Increment the view count for the given forum post ID
ForumPostSchema.statics.incrementViewCount = async function(postId) {
    const post = await this.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
  
    post.viewCount++;
    await post.save();
  };

module.exports = mongoose.model('ForumPost', ForumPostSchema);