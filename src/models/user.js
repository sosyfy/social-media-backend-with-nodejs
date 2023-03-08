const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    userInfo: {
        type : mongoose.Schema.ObjectId,
        ref: 'Auth',
        required: true,
      },
    jobTitle :{
        type: String,
        // required : true 
    },
    about:{
        type: String, 
    },
    connections: {
        type: Array,
        default: [],
    },
    location: String,
    experience : [ 
        {
           position : {
               type: String,
            //    required : true 
           },
           company: {
               type: String,
            //    required: true 
           },
           type: {
               type: String,
            //    required: true 
           },
           startDate : {
               type: String,
            //    required : true 
           },
           endDate : {
               type: String,
            //    required : true 
           },
        }
      ],
    education : [ 
        {
           schoolName : {
               type: String,
            //    required : true 
           },
           course: {
               type: String,
            //    required: true 
           },
           startDate : {
               type: String,
            //    required : true 
           },
           graduationDate : {
               type: String,
            //    required : true 
           },
        }
      ],
    skills : {
        type: [String],
        default: []
    },
    preferredPositions: [
        {
            position: {
                type: String,
                // required:true
            },
            years: {
                type: Number,
                // required:true
            }
        }
    ],
    bookmarkedPosts: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
 

