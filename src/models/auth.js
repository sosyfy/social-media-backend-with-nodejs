const  mongoose = require('mongoose')
const  bcrypt = require('bcryptjs')
const  crypto = require('crypto')

const authSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        select: false 
      },
      firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      adminNo: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      photo: {
        type: String,
        default: ''
      },
      emailVerificationToken: {
        type: String 
      },
      forgotPasswordToken: {
        type: String 
      },
      forgotPasswordExpiry: {
        type: Date
      },
    },
    {
      timestamps: true,
    }
  )

//& encrypt password before save 

authSchema.pre('save', async function(next){
   //& If password is not modified wont encrypt 
   
   if(!this.isModified('password')) return next();

   //& If password is  modified encrypt it 
    
    this.password = await bcrypt.hash(this.password, 10 )
})

//& vaidate the password with user password 

authSchema.methods.isValidatedPassword = async function(sentPassword){
  return  await  bcrypt.compare( sentPassword, this.password )
}



//& generate forgot password token 

authSchema.methods.getForgetPasswordToken = function(){
    //& generate a long and random string 

    const token = crypto.randomBytes(20).toString('hex');

    //& creating  a hashed token on Db
    this.forgotPasswordToken = crypto.createHash('sha256').update(token).digest("hex")
    //&  creating a token expiry time Db 
    //^ now its set to 20 minutes from time of cretion 

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000 

    //& return the unecrypted token to send the user 
    return token  
}


//& generate email verification token 

authSchema.methods.getEmailVerificationToken = function(){
    //& generate a long and random string 
    const token = crypto.randomBytes(20).toString('hex');

    //& creating  a hashed token on Db
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest("hex")
   
    //& return the unecrypted token to send the user 
    return token  
}


module.exports = mongoose.model('Auth', authSchema)
