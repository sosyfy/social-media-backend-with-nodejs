const express = require('express');
const router = express.Router();
const controller = require( '#controllers/forum')
const verifyToken = require("#middlewares/verifyToken")
const { incrementForumPostViews } = require('#middlewares/forum');
// POST 
router.post('/', verifyToken, controller.createForumPost);

// READ  
router.get('/:category',verifyToken, controller.getForumPostsByCategory);
router.get('/:category/:filter',verifyToken,  controller.getFilteredForumPosts);
router.get('/:forumPostId', verifyToken,incrementForumPostViews, controller.getForumPostById);
// UPDATE
router.put('/like/:forumPostId', verifyToken, controller.likeForumPost);
router.put('/:forumPostId', verifyToken, controller.editForumPost);


module.exports = router