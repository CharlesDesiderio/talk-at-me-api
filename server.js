// DEPENDENCIES
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')

// CONFIGURATION
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const whitelist = ['https://talkatme.herokuapp.com']
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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