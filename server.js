// DEPENDENCIES
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')

// CONFIGURATION
require('dotenv').config()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))

//MIDDLEWARE
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//DATABASE
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log(`Connected to MONGODB at ${MONGODB_URI}`)
})

// CONTROLLERS
const userController = require('./controllers/user.js')
app.use('/users', userController)

const postController = require('./controllers/post.js')
app.use('/posts', postController)

app.get('/', (req, res) => {
  res.send('Success')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})