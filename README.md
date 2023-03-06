
A Boilerplate/Generator/Starter template for building RESTful APIs and microservices using modern Javascript, Node.js, Express and MongoDB.

This is a highly opinionated and fully featured starter template, if you don't need some feature or dependency, just delete it.

## Requirements

- [Node 18+](https://nodejs.org/en/download/)

## Features

- No transpilers, just vanilla javascript
- CORS configuration
- Structured logs with [morgan](https://github.com/expressjs/morgan) .You can change from dev to tiny.
- API documentation with [OpenAPI v3](https://swagger.io/specification/) and [Swagger UI](https://swagger.io/tools/swagger-ui/) yet to be done fully but a basic setup is done. 
- MongoDB ORM with [Mongoose](https://mongoosejs.com/) .you can use local mongod or Atlas 
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Automatic error handling for express asynchronous routes with [express-async-errors](https://github.com/davidbanham/express-async-errors)
- Auto reload with nodemon
- Advanced Auth with cookies, email verification etc 
- Integration with mailing service am using SendGrid but you can use any other of your preference 
- configured package.json for simpler import routes. this can also be edited to your preference.
- Well documented auth to understand what is happening 

## Getting Started

# Locally
1. Download  or clone template 
2. open the project and in the terminal run 
```bash
 npm install 
```
3. create a .env file and add the fields in the .env.example 

4. run 
```bash 
 npm run dev 
```

# Github 

Click use this template and follow same steps as in locall 

## Scripts
```bash
npm run start      # starts server
npm run dev        # starts server in watch mode, waiting for file changes
```

## Environment Variables

Use the .env.example file provided 
