const Post = require('#models/post')
const User = require('#models/user')
const mongoose = require('mongoose')
const cloudinary = require("cloudinary").v2
const config = require('#config')


// CREATE
exports.createPost = async (req, res) => {
    console.log(req.body, req.files);
    try {

        // Configuration 
        cloudinary.config({
            cloud_name: config.cloudinary.cloud_name,
            api_key: config.cloudinary.key,
            api_secret: config.cloudinary.secret
        });

        let result;

        if (req.files) {
            let file = req.files.media;
            result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "posts"
            })
            const userId = mongoose.Types.ObjectId(req.user.id)
            const user = await User.findById(userId)
            await Post.create({ title: req.body.title, user: userId, userInfo: user.userInfo, photo: result.secure_url })

        } else {
            const userId = mongoose.Types.ObjectId(req.user.id)
            const user = await User.findById(userId)
            await Post.create({ title: req.body.title, user: userId, userInfo: user.userInfo })
        }



        
        const posts = await Post.find().populate("userInfo")

        return res.status(201).json(posts)
    } catch (error) {
        console.log(error.message);
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
        const currentUser = await User.findById(req.user.id);
        const posts = await Post.find()
          .populate("userInfo")
          .sort({ createdAt: -1 });
        const currentUserPosts = await Post.find({ user: req.user.id })
          .populate("userInfo")
          .sort({ createdAt: -1 });
        const friendsPosts = posts.filter((post) =>
          currentUser.connections.some(
            (some) => some._id.toString() === post.user.toString()
          )
        );
      
        let timelinePosts = [...currentUserPosts, ...friendsPosts].sort(
          (a, b) => b.createdAt - a.createdAt
        );
      
        // Use a Set to keep track of post IDs
        const postIds = new Set();
        timelinePosts = timelinePosts.filter((post) => {
          if (!postIds.has(post._id.toString())) {
            postIds.add(post._id.toString());
            return true;
          }
          return false;
        });
      
        if (timelinePosts.length > 40) {
          timelinePosts = timelinePosts.slice(0, 40);
        } else if (timelinePosts.length < 10) {
          let otherPosts = posts
            .filter((post) => !timelinePosts.includes(post))
            .slice(0, 30);
          timelinePosts = [...otherPosts, ...timelinePosts].sort(
            (a, b) => b.createdAt - a.createdAt
          );
        }
      
        return res.status(200).json(timelinePosts);
      } catch (error) {
        return res.status(500).json(error.message);
      }
      
      
}

exports.getOnePost = async (req, res) => {
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

exports.deletePost = async (req, res) => {
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


exports.toggleLikePost = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)

        if (post.likes.includes(currentUserId)) {
            post.likes = post.likes.filter((id) => id !== currentUserId)
            post.liked = false
            await post.save()
            return res.status(200).json({ post: post, msg: "Successfully unliked the post" })
        } else {
            post.likes.push(currentUserId)
            post.liked = true
            await post.save()
            return res.status(200).json({ post: post, msg: "Successfully liked the post" })
        }

    } catch (error) {
        return res.status(500).json(error.message)
    }
}


