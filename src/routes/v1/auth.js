const express = require('express')
const controller = require( '../../controllers/auth')

const router = express.Router()

 
router.route('/register').post(controller.register)

router.route('/login').post(controller.logInWithEmailAndPassword)


router.route('/logout').post(controller.logout)


module.exports = router