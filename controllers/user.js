// DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// MODELS
const User = require('../models/user.js')
const users = express.Router()


// users.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Success'
//   })
// })

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
  User.find({ email: req.body.email }, (err, foundUser) => {
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
              token: token
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