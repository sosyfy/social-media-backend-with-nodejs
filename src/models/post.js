const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    title: {
      type: String,
      required: true,
      min: 4,
    },
    photo: {
        type: String,
        default: ''
    },
    likes: {
        type: [String],
        default: []
    },
    liked: {
        type: Boolean,
        default: false
    },
    comments: {
        type: [String],
        default: []
    },
  
    location: {
        type: String,
        default: ''
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)