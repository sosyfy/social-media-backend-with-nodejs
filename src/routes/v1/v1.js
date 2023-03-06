const express = require('express')
const authRoutes = require('#routes/v1/auth')
const userRoutes = require('#routes/v1/user')


const router = express.Router()
  .use('/user', userRoutes)
  .use('/auth', authRoutes)

module.exports = router