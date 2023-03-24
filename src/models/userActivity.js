const mongoose = require("mongoose");


const userActivitySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumPost",
    required: true,
  },
  interaction_type: {
    type: String,
    enum: ["like", "comment", "share"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});


const UserActivity = mongoose.model("UserActivity", userActivitySchema);


module.exports = UserActivity;
