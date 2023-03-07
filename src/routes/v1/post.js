const express = require('express')
const controller = require( '#controllers/post')
const verifyToken = require("#middlewares/verifyToken")
const router = express.Router()

// GET
router.route('/find/user-posts/:id').get(verifyToken ,controller.getUserPosts)
router.route('/timeline/posts').get(verifyToken ,controller.getTimelinePosts)
router.route('/find/:id').get(verifyToken, controller.getOnePost)
// POST
router.route('/').post(verifyToken,controller.createPost)
//PUT
router.route('/:id').put(verifyToken,controller.updatePost)
router.route('/toggleLike/:id').put(verifyToken,controller.toggleLikePost)
//DELETE
router.route('/:id').delete(verifyToken,controller.deletePost)


module.exports = router