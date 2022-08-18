const express = require('express');
const mongoose = require('mongoose');
// const { Post } = require('./models/post')
const { postRouter } = require('./routes/postRoute')
const { mainRouter } = require('./routes/mainRoute')
const dotenv = require('dotenv').config();

const PORT  = process.env.PORT || 5000

// initializing the app
const app = express()

// setting default
app.set('view engine', 'ejs')

// setting up middleware
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))


// connecting to the database
let dbURI = process.env.MONGO_URI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
}).catch((error) => {
    console.log(error)
})

// Everything related to creating, reading, updating, and deleting posts
app.use('/posts', postRouter)

// homepage
app.use(mainRouter)


// about route
