const Post = require('#models/post')
const User = require('#models/user')
const mongoose = require('mongoose')


// CREATE
exports.createPost = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id)
        const user =  await User.findById(userId)
        await Post.create({ ...req.body, user: userId, userInfo: user.userInfo })
        const posts = await Post.find().populate("userInfo")
        
        return res.status(201).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

// READ 
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id }).populate("userInfo")

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getTimelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const posts = await Post.find().populate("userInfo")
        const currentUserPosts = await Post.find({ user: req.user.id }).populate("userInfo")
        const friendsPosts = posts.filter((post) => {
            return currentUser.connections.includes(post.user)
        })

        let timelinePosts = currentUserPosts.concat(...friendsPosts)

        if (timelinePosts.length > 40) {
            timelinePosts = timelinePosts.slice(0, 40)
        }

        return res.status(200).json(timelinePosts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getOnePost =  async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).populate("userInfo")
        if (!post) {
            return res.status(500).json({ msg: "No such post with this id!" })
        } else {
            return res.status(200).json(post
            )
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


// UPDATE
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.user.toString() === req.user.id.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id,
                { $set: req.body }, { new: true })
            return res.status(200).json(updatedPost)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.deletePost =  async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(500).json({ msg: "No such post" })
        } else if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "You can delete only your own posts" })
        } else {
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: "Post is successfully deleted" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


exports.toggleLikePost =  async(req, res) => {
    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)

        if(post.likes.includes(currentUserId)){
           post.likes = post.likes.filter((id) => id !== currentUserId)
           await post.save()
           return res.status(200).json({post: post , msg: "Successfully unliked the post"})
        } else {
           post.likes.push(currentUserId)
           await post.save()
           return res.status(200).json({ post: post ,msg: "Successfully liked the post"})
        } 

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

