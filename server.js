// DEPENDENCIES
const express = require('express')
const mongoose = require('mongoose')
const app = express();

// CONFIGURATION

const PORT = 3000


app.get('/', (req, res) => {
  res.send('Success')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})