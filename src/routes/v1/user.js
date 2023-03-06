const express = require('express')
const controller = require( '#controllers/user')
const verifyToken = require("#middlewares/verifyToken")
const router = express.Router()

 
router.route('/find/:id').get(verifyToken ,controller.getUser)
router.route('/find/all').get(verifyToken ,controller.getAllUsers)
router.route('/find/suggestedConnections').get(verifyToken, controller.getSuggestedConnections)

router.route('/updateUser/:userId').post(verifyToken,controller.updateUser)
router.route('/toggleConnection/:id/:connectionId').post(verifyToken,controller.addRemoveConnection)


module.exports = router