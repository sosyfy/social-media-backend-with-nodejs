const uploadController = require('express').Router()
const multer = require("multer")
const verifyToken = require('../middlewares/verifyToken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})

uploadController.post('/image', upload.single('image'), async(req, res) => {
    try {
        return res.status(200).json({msg: "image successfully uploaded"})
    } catch (error) {
        console.log(error) 
    }
})

module.exports = uploadController