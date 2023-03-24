const express = require('express');
const router = express.Router();
const controller = require( '#controllers/forum')
const verifyToken = require("#middlewares/verifyToken")
// POST 
router.post('/', verifyToken, controller.createForumPost);

// READ  
// router.get('/:category',verifyToken, controller.getForumPostsByCategory);
router.get('/forum-posts',verifyToken, controller.getAllForumPosts);

router.get('/filter/:category/:filter',verifyToken,  controller.getFilteredForumPosts);
router.get('/single/:forumPostId', verifyToken , controller.getForumPostById);
// UPDATE
router.put('/toggle-like/:forumPostId', verifyToken, controller.likeForumPost);
router.put('/:forumPostId', verifyToken, controller.editForumPost);


module.exports = router