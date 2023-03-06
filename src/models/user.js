import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user: {
        type : mongoose.Schema.ObjectId,
        ref: 'Auth',
        required: true 
      },
    jobTitle :{
        type: String,
        required : true 
    },
    about:{
        type: String, 
    },
    connections: {
        type: Array,
        default: [],
    },
    location: String,
    photo: {
        id: { 
            type: String,
        }, 
        
        secure_url: { 
            type: String,
        }, 
        
    },
    experience : [ 
        {
           position : {
               type: String,
               required : true 
           },
           company: {
               type: String,
               required: true 
           },
           type: {
               type: String,
               required: true 
           },
           startDate : {
               type: Number,
               required : true 
           },
           endDate : {
               type: Number,
               required : true 
           },
        }
      ],
    education : [ 
        {
           schoolName : {
               type: String,
               required : true 
           },
           course: {
               type: String,
               required: true 
           },
           startDate : {
               type: Number,
               required : true 
           },
           graduationDate : {
               type: Number,
               required : true 
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
                required:true
            },
            years: {
                type: Number,
                required:true
            }
        }
    ],
    bookmarkedPosts: {
        type: Array,
        default: []
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
