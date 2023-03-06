const  mongoose = require('mongoose')
const  bcrypt = require('bcryptjs')
const  crypto = require('crypto')
const roles = ['user', 'admin']

const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 500,
        select: false 
      },
      name: {
        type: String,
        required: true,
        maxlength: 500,
        index: true,
        trim: true,
      },
      role: {
        type: String,
        enum: roles,
        default: 'user',
      },
      photoUrl: {
        type: String,
        trim: true,
      },
      emailVerified: {
        type: Boolean,
        default: false,
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

userSchema.pre('save', async function(next){
   //& If password is not modified wont encrypt 
   
   if(!this.isModified('password')) return next();

   //& If password is  modified encrypt it 
    
    this.password = await bcrypt.hash(this.password, 10 )
})

//& vaidate the password with user password 

userSchema.methods.isValidatedPassword = async function(sentPassword){
  return  await  bcrypt.compare( sentPassword, this.password )
}



//& generate forgot password token 

userSchema.methods.getForgetPasswordToken = function(){
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

userSchema.methods.getEmailVerificationToken = function(){
    //& generate a long and random string 
    const token = crypto.randomBytes(20).toString('hex');

    //& creating  a hashed token on Db
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest("hex")
   
    //& return the unecrypted token to send the user 
    return token  
}

class UserClass {
    constructor({ name, email, role, photoUrl, createdAt, updatedAt }) {
      this._id = new ObjectId()
      this.emailVerified = false
      this.name = name
      this.email = email
      this.role = role
      this.photoUrl = photoUrl
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
  
    format() {
      return {
        type: 'users',
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        photoUrl: this.photoUrl,
        emailVerified: this.emailVerified,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      }
    }
}

userSchema.loadClass(UserClass)

module.exports = mongoose.model('User', userSchema)
