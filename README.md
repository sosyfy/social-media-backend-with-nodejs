Mock server: 
- [Mock Postman Server](https://709e80f9-f1d9-484d-8720-173a9314a64e.mock.pstmn.io)

documentation:
- [Postman Documentation](https://documenter.getpostman.com/view/20962669/2s93JqSkYP)

## Setup and use collection 

Go to the documentation and import collection from there.
After import , click on the environments tab and select socials environment. 
Authorization is set up by default but incase you mess with it, tap on the collection name and set the auth method to bearer token and add the token you get from login api.


## Brief summary 

Our social media REST API provides a comprehensive set of tools for users to engage with popular social media platforms. The API includes five main endpoints: auth, user, post, comment, and forum.

With the auth endpoint, users can easily authenticate themselves and gain access to their social media account data. The user endpoint allows users to manage their account information, including profile details and follower counts.


With the post endpoint, users can create and retrieve posts in a variety of formats, including text, photos, and videos. Users can also search for posts based on keywords or hashtags.


The comment endpoint enables users to interact with comments on posts, including adding new comments and moderating existing ones. Finally, the forum endpoint provides a platform for users to engage in online discussions on a variety of topics.


Overall, our social media REST API provides a user-friendly way for users to engage with their favorite social media platforms, with powerful tools and functionality that enable them to create, share, and connect with others online.


## Requirements

- [Node 18+](https://nodejs.org/en/download/)



## Getting Started

# Locally
1. Download  or clone project 
2. open the project and in the terminal run 
```bash
 npm install 
```
3. create a .env file and add the fields in the .env.example 

4. run 
```bash 
 npm run dev 
```


## Scripts
```bash
npm run start      # starts server
npm run dev        # starts server in watch mode, waiting for file changes
```

## Environment Variables

Use the .env.example file provided 
