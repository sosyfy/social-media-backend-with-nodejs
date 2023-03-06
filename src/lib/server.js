require( 'express-async-errors')
const express = require("express")
const cors = require( 'cors')
const morgan = require( 'morgan')
const cookieParser = require( "cookie-parser")
const fileUpload = require( "express-fileupload")
const xss = require( 'xss-clean')
const hpp = require( 'hpp')
const bodyParser = require( 'body-parser')
const rateLimit = require( 'express-rate-limit')
const helmet = require( 'helmet')
const swaggerUi = require( 'swagger-ui-express')


const app = express()

const swaggerFile = require('../../swagger-output.json')
 
const v1routes = require( '#routes/v1/v1')




//& Allow Cross-Origin requests
app.use(cors());

//& Set security HTTP headers
app.use(helmet());

//& Limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

//& Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

//& Prevent parameter pollution
app.use(hpp());

//& reqular middlewares 
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true }))

//& coookies and file upload 

app.use(cookieParser())
app.use(fileUpload())


//& morgan middleware  to display logs on console of visited routes 
app.use(morgan("dev"))


//& swagger ui documentation for api's 
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs));


//& routes
app.use('/v1', v1routes)



module.exports =  app
