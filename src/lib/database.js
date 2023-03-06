const mongoose = require('mongoose')

exports.connect =  async function (uri) {
    await mongoose.connect(uri, {
        //& must add in order to not get any error masseges:
        useUnifiedTopology:true,
        useNewUrlParser: true 
    }).then(
        console.log("DB CONNECTED SUCCESS")
        
    ).catch(error => {
        console.log("DB CONNECTION FAILED ", error)
        process.exit(1)  
    })

    return true
  }
  
exports.disconnect = async function () {
    await mongoose.disconnect()
  }