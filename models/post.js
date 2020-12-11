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
  comments: [{
      userId: String,
      commentDate: String,
      commentText: String
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post