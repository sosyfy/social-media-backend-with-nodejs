const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
      type: String,
      required: true,
      min: 4,
    },
    desc: {
        type: String,
        required: true,
        min: 8
    },
    photo: {
        type: String,
        default: ''
    },
    likes: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)