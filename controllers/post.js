// DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')

// MODELS
const Post = require('../models/post.js')
const posts = express.Router()

posts.get('/', (req, res) => {
  res.status(200).json({
    message: 'Success'
  })
})

module.exports = posts