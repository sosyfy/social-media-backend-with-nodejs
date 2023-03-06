
const  path = require('path')
const  dotenv = require('dotenv')

dotenv.config()
 
module.exports = Object.freeze({
    version: "0.0.0",
    openApiPath:'../openapi.yaml',
    env: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
    auth: {
      jwtSecret: process.env.JWT_SECRET,
      jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    },

    mongo: {
      uri: process.env.MONGO_URI,
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      from: process.env.EMAIL_FROM,
      service: process.env.EMAIL_SERVICE,
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  })