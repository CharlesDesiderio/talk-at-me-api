// DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')

// MODELS
const User = require('../models/user.js')
const users = express.Router()

users.get('/', (req, res) => {
  res.status(200).json({
    message: 'Success'
  })
})

module.exports = users