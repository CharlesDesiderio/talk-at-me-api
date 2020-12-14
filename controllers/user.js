// DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// MODELS
const User = require('../models/user.js')
const users = express.Router()

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
users.post('/register', (req, res) => {
  // Initialize empty arrays for data in model
  req.body.following = []
  req.body.followers = []
  req.body.posts = []
  req.body.messages = []

  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  
  User.find({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    else if (foundUser.length > 0) {
      res.status(400).json({
        message: 'User already exists'
      })
    } else {
      User.create(req.body, (err, createdUser) => {
        if (err) {
          res.status(400).json({
            error: err
          })
        } else {

          const user = {
            id: createdUser._id,
            email: createdUser.email,
            displayName: createdUser.displayName
          }

          jwt.sign({ user }, process.env.SECRET_TOKEN, (err, token) => {
            if (err) {
              res.status(400).json({
                error: err
              })
            } else {
              res.status(200).json({
                newUser: createdUser,
                token: token
              })
            }
          })
        }
      })
    }
  })
})

users.post('/login', (req, res) => {
  User.find({ email: req.body.email.toLowerCase() }, (err, foundUser) => {
    console.log(req.body)
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    else if (foundUser.length === 0) {
      res.status(400).json({
        message: 'User not found'
      })
    } else {
      // Found user
      if (bcrypt.compareSync(req.body.password, foundUser[0].password)) {
        const user = {
          userId: foundUser[0]._id,
          displayName: foundUser[0].displayName,
          email: foundUser[0].email
        }
        jwt.sign({ user }, process.env.SECRET_TOKEN, (err, token) => {
          if (err) {
            res.status(400).json({
              error: err
            })
          } else {
            res.status(200).json({
              token: token,
              user: user
            })
          }
        })

      } else {
        res.status(400).json({
          message: 'Invalid Password'
        })
        }

    }
  })
})

users.put('/follow', verifyToken, (req, res) => {
  User.findById(req.body.userId, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      let newFollowerAdded = foundUser
      if (newFollowerAdded.followers.includes(req.user.user.userId)) {
        newFollowerAdded.followers.splice(newFollowerAdded.followers.indexOf(req.user.user.userId), 1)
      } else {
        newFollowerAdded.followers.push(req.user.user.userId)
      }
      User.findByIdAndUpdate(req.body.userId, newFollowerAdded, (err, foundUser) => {
        if (err) {
          res.status(400).json({
            error: err
          })
        } else {
          res.status(200).json({
            foundUser: foundUser
          })
        }
      })
    }
  })
})

users.get('/profile', verifyToken, (req, res) => {
  User.findById(req.body.userId, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else {
      let userData = foundUser
      userData.password = undefined
      console.log(userData)
      res.status(200).json({
        foundUser: userData
      })
    }
  })
})

// USER SCHEMA FOR REFERENCE
// displayName: {
//   type: String,
//   required: true
// },
// email: {
//   type: String,
//   required: true
// },
// password: {
//   type: String,
//   required: true
// },
// nativeLanguage: {
//   type: String,
//   required: true
// },
// targetLanguage: {
//   type: String,
//   required: true
// },
// following: [String],
// followers: [String],
// posts: [String],
// messages: [String]

module.exports = users