const mongoose = require('mongoose')

const userIds = [
  new mongoose.Types.ObjectId(),
];

export const users = [
    {
      _id: userIds[0],
      firstName: "test",
      lastName: "me",
      email: "aaaaaaa@gmail.com",
      password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
      picturePath: "p11.jpeg",
      friends: [],
      location: "San Fran, CA",
      occupation: "Software Engineer",
      viewedProfile: 14561,
      impressions: 888822,
      createdAt: 1115211422,
      updatedAt: 1115211422,
      __v: 0,
    }
]

