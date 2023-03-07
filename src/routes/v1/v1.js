const express = require('express')
const authRoutes = require('#routes/v1/auth')
const userRoutes = require('#routes/v1/user')
const postRoutes = require('#routes/v1/post')


const router = express.Router()
  .use('/user', userRoutes)
  .use('/auth', authRoutes)
  .use('/post', postRoutes)


module.exports = router