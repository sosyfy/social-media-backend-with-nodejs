const httpStatus = require('http-status')
const { addMinutes, getUnixTime } = require('date-fns')
const Auth = require('#models/auth')
const User = require('#models/user')
const Errors = require('#errors/common')
const config = require('#config')
const sendMail = require('#lib/email')
const jwt = require('jwt-simple')
const crypto = require("crypto")



exports.register = async (req, res) => {
  try {
    const isExisting = await Auth.findOne({ email: req.body.email })
    if (isExisting) {
      throw new Error("Already such an email registered.")
    }

    const newAuth = await Auth.create({ ...req.body })
    // console.log(newAuth);
    const newUser = await User.create({ userInfo: newAuth._id, email: newAuth.email })
    console.log(newUser);
    // & sending a token after user creation
    const token = createAccessToken(newUser)
    const options = {
      expires: token.expiresIn,
      httpOnly: true
    }
    

    res.status(httpStatus.CREATED).cookie('token', token.token, options).json({
      status: true,
      message: "success",
      token: token,
      user: newUser
    })

  } catch (error) {
    return res.status(500).json(error.message)
  }
}

// ? login user function with email and password 
exports.logInWithEmailAndPassword = async function (req, res, next) {
  try {
    const { email, password } = req.body

    //& data validtion from frontend 
    if (!email || !password) {
      return next(new Errors.ApiError())
    }
    //& Check if user exists in db if yes fetch them 
    const user = await Auth.findOne({ email }).select("+password")

    if (!user) {
      return next(new Errors.UserNotFoundError())
    }

    //& validating the password if they match with one from Db 
    const isPasswordCorrect = await user.isValidatedPassword(password)

    if (!isPasswordCorrect) {
      return next(new Errors.IncorrectEmailOrPasswordError())
    }

    const currentUser = await User.findOne({ userData: user._id});
   
    //& sending a token after validation  
    const token = createAccessToken(currentUser)
    const options = {
      expires: token.expiresIn,
      httpOnly: true
    }

    res.status(httpStatus.CREATED).cookie('token', token.token, options).json({
      status: true,
      message: "success",
      token: token,
      user: user
    })


  } catch (error) {
    return next(new Errors.ApiError())
  }

}

// ? Reset password and create new one function 
exports.emailVerification = async function (req, res, next) {

  try {
    //& get reset pasword token and encrypt it to match the Db one 
    const token = req.params.token
    const encryptedToken = crypto.createHash('sha256').update(token).digest("hex")

    //& get user with same encrypted token
    const user = await Auth.findOne({ emailVerificationToken: encryptedToken })

    if (!user) {
      return next(new Errors.ApiError())
    }

    //& save the emailVerified to Db and  delete the token 

    user.emailVerificationToken = undefined
    user.emailVerified = true

    await user.save({ validateBeforeSave: false })

    //& sending a token after verification 
    const newToken = createAccessToken(user)
    const options = {
      expires: token.expiresIn,
      httpOnly: true
    }

    res.status(httpStatus.CREATED).cookie('token', newToken.token, options).json({
      status: true,
      message: "success",
      token: newToken,
      user: user
    })

  } catch (error) {
    return next(new Errors.ApiError())
  }
}



// ? logout  user function 
exports.logout = async function (req, res, next) {
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true })

  res.status(httpStatus.OK).json({
    success: true,
    message: "logout success"
  })
}

// ? Send forget password email function 
exports.forgotPassword = async function (req, res, next) {

  const { email } = req.body
  //& data validtion from frontend 

  if (!email) {
    return next(new Errors.ApiError())
  }
  //&  check if user exists in the DB 

  const user = await Auth.findOne({ email })

  if (!user) {
    return next(new Errors.UserNotFoundError())
  }

  //& Create a token and save it in the database 
  const forgotToken = await user.getForgetPasswordToken();
  await user.save({ validateBeforeSave: false })

  //& Send the user a reset pasword to their email 

  const url = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`
  const message = `Copy paste this link in our Url and hit enter \n\n ${url}`

  try {

    await sendMail({
      to: user.email,
      subject: "Password reset",
      html: message
    })

    res.status(httpStatus.OK).json({
      success: true,
      message: "Email sent Successfully",
      info: "Check your email and follow the steps to recover your account "
    })

  } catch (error) {
    //& if the email wasnt sent we delete the  token from db 

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    await user.save({ validateBeforeSave: false })

    //& send an error response 

    return next(new Errors.ApiError())
  }


}

// ? Reset password and create new one function 

exports.passwordReset = async function (req, res, next) {

  try {
    //& get reset pasword token and encrypt it to match the Db one 
    const token = req.params.token
    const encryptedToken = crypto.createHash('sha256').update(token).digest("hex")

    //& geet user with same encrypted token and not expired 

    const user = await Auth.findOne({
      forgotPasswordToken: encryptedToken,
      forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return next(new Errors.ApiError())
    }

    //& save the new password to Db and  delete the tokens 
    user.password = req.body.password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save({ validateBeforeSave: false })

    //& send user a new token     
    //& sending a token after user creation
    const newToken = createAccessToken(user)
    const options = {
      expires: token.expiresIn,
      httpOnly: true
    }

    //& remember not to send the password 
    //  user.password = undefined 

    res.status(httpStatus.CREATED).cookie('token', newToken.token, options).json({
      status: true,
      message: "success",
      token: newToken,
      user: user
    })

  } catch (error) {
    return next(new Errors.ApiError())
  }
}


//? Update user password function 

exports.passwordUpdate = async function (req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body

    //& data validtion from frontend 
    if (!oldPassword) {
      return next(new Errors.ApiError())
    }

    //& get old password from Db and validate if it is same to the one sent 
    const user = await Auth.findById(req.user.id).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(oldPassword)

    if (!isCorrectOldPassword) {
      return next(new Errors.ApiError())
    }

    //& Update the password and send them a new login token 

    user.password = newPassword

    await user.save()

    res.status(httpStatus.CREATED).json({
      status: true,
      message: "success",
      user: user
    })

  } catch (error) {
    return next(new Errors.ApiError())
  }
}


//* Helper functions 
function createAccessToken(user) {
  return {
    tokenType: "Bearer",
    expiresIn: addMinutes(Date.now(), config.auth.jwtExpirationInterval),
    token: createJwt(user._id),
  }
}

function createJwt(encoder) {
  const payload = {
    exp: getUnixTime(addMinutes(Date.now(), config.auth.jwtExpirationInterval)),
    iat: getUnixTime(Date.now()),
    id: encoder,
  }
  return jwt.encode(payload, config.auth.jwtSecret)
}