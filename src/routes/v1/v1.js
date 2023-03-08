const express = require('express')
const authRoutes = require('#routes/v1/auth')
const userRoutes = require('#routes/v1/user')
const postRoutes = require('#routes/v1/post')
const commentRoutes = require('#routes/v1/comment')
const forumRoutes = require('#routes/v1/forum')


const router = express.Router()
  .use('/user', userRoutes)
  .use('/auth', authRoutes)
  .use('/post', postRoutes)
  .use('/comment', commentRoutes)
  .use('/forum', forumRoutes)


module.exports = router