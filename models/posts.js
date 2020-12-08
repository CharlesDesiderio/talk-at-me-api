const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  postCreator: {
    type: String,
    required: true
  },
  postDate: {
    type: String,
    required: true
  },
  postedText: {
    type: String,
    required: true
  },
  postLanguage: {
    type: String,
    required: true
  },
  likedUsers: [String],
  comments: [
    {
      userId: {
        Type: String,
        required: true
      },
      commentDate: {
        Type: String,
        required: true
      },
      commentText: {
        Type: String,
        required: true
      }
    }
  ]
})

const User = mongoose.model('Post', postSchema)

module.exports = Post