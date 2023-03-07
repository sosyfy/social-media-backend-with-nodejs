const express = require('express')
const controller = require( '#controllers/comment')
const verifyToken = require("#middlewares/verifyToken")
const router = express.Router()

// GET
router.route('/:postId').get(verifyToken ,controller.getAllPostComments)
router.route('/find/:commentId').get(verifyToken ,controller.getOneComment)
// POST
router.route('/').post(verifyToken,controller.createComment)
//PUT
router.route('/:commentId').put(verifyToken,controller.updateComment)
router.route('/toggle-like/:commentId').put(verifyToken,controller.toggleCommentLike)
//DELETE
router.route('/:commentId').delete(verifyToken,controller.deleteComment)


module.exports = router