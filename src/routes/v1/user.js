const express = require('express')
const controller = require( '#controllers/user')
const verifyToken = require("#middlewares/verifyToken")
const router = express.Router()

 
router.route('/:id').get(verifyToken ,controller.getUser)
router.route('/find/all').get(verifyToken ,controller.getAllUsers)
router.route('/find/suggested-connections').get(verifyToken, controller.getSuggestedConnections)

router.route('/update-user/:userId').post(verifyToken,controller.updateUser)
router.route('/toggle-connection/:id/:connectionId').post(verifyToken,controller.addRemoveConnection)


module.exports = router