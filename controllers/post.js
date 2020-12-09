// DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')

// MODELS
const Post = require('../models/post.js')
const User = require('../models/user.js')
const posts = express.Router()

// MIDDLEWARE
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    req.user = jwt.verify(req.token, process.env.SECRET_TOKEN)
    next()
  } else {
    res.status(403).json({
      error: 'Forbidden'
    })
  }
}

posts.get('/', verifyToken, (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      res.status(200).json({
        posts: foundPosts
      })
    }
  })
})

posts.post('/', verifyToken, (req, res) => {
  const newPost = {
    postCreator: req.user.user.userId,
    postDate: Date.now(),
    postedText: req.body.text,
    postLanguage: req.body.language,
    likedUsers: [],
    comments: []
  }

  Post.create(newPost, (err, createdPost) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      res.status(200).json({
        message: 'Success!',
        post: createdPost
      })
    }
  })
})


// Post schema reference
// postCreator: {
//   type: String,
//   required: true
// },
// postDate: {
//   type: String,
//   required: true
// },
// postedText: {
//   type: String,
//   required: true
// },
// postLanguage: {
//   type: String,
//   required: true
// },
// likedUsers: [String],
// comments: [{
//     userId: String,
//     commentDate: String,
//     commentText: String
//   }]


module.exports = posts