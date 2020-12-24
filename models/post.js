const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  postCreator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  postCreatorId: String,
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
  likedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [
    {
    commentCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    commentDate: String,
    commentText: String
}]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post