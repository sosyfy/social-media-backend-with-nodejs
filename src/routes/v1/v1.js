const express = require('express')
const authRoutes = require('#routes/v1/auth')


const router = express.Router()
  // .use('/users', userRoutes)
  .use('/auth', authRoutes)

module.exports = router