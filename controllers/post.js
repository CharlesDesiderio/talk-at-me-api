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
      
      // I need to replace the IDs of the users with their current display names (or add that display name and add the ID for profile linking)

      User.find({}, (err, foundUsers) => {

        if (err) {
          res.status(400).json({
            error: err
          })
        } else {
          foundPosts.forEach(post => {
            foundPosts[foundPosts.indexOf(post)].postCreator = foundUsers[foundUsers.findIndex(user => {
              return user._id.toString() == post.postCreator.toString()
            })].displayName

            if (post.comments.length > 0) {
              post.comments.forEach(comment => {
                post.comments[post.comments.indexOf(comment)].userId = foundUsers[foundUsers.findIndex(user => {
                  return user._id.toString() == comment.userId.toString()
                })].displayName
                console.log(comment)
              })
            }
          })

          res.status(200).json({
            posts: foundPosts
          })
        }
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

posts.get('/like/:id', verifyToken, (req, res) => {
  console.log('ping')
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      let likes = foundPost.likedUsers;
      console.log(foundPost)
      console.log(foundPost.likedUsers.includes(req.user.user.userId))
      if (likes.includes(req.user.user.userId)) {
        likes.splice(likes.indexOf(req.user.user.userId), 1)
      } else {
        likes.push(req.user.user.userId)
      }
      let updatedPost = foundPost
      updatedPost.likedUsers = likes;
      Post.findByIdAndUpdate(req.params.id, updatedPost, (err, foundPost) => {
        if (err) {
          res.status(400).json({
            error: err
          })
        } else {
          res.json({foundPost: foundPost})
        }
      })
    }
  })
})

posts.put('/comment', verifyToken, (req, res) => {

  let commentData = {
    userId: req.user.user.userId,
    commentDate: Date.now(),
    commentText: req.body.commentText
  }
  Post.findById(req.body.postId, (err, foundPost) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      let newPostData = foundPost
      newPostData.comments.push(commentData)
      Post.findByIdAndUpdate(req.body.postId, newPostData, (err, updatedPost) => {
        if (err) {
          res.status(400).json({
            error: err
          })
        } else {
          console.log(newPostData)
          res.status(200).json({
            updatedPost: updatedPost
          })
        }
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