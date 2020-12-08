const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nativeLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  following: [String],
  followers: [String],
  posts: [String],
  messages: [String]
})

const User = mongoose.model('User', userSchema)

module.exports = User