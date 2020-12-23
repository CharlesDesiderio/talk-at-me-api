const mongoose = require('mongoose')

const User = require('../models/user.js')

const commentSchema = mongoose.Schema({
  commentCreator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  commentDate: {
    type: String,
    required: true
  },
  commentText: {
    type: String,
    required: true
  }
})

const postSchema = mongoose.Schema({
  postCreator: {
    type: String,
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
  likedUsers: [String],
  comments: [commentSchema]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post