const express = require('express');
const mongoose = require('mongoose');
// const { Post } = require('./models/post')
const { postRouter } = require('./routes/postRoute')
const { mainRouter } = require('./routes/mainRoute')

// initializing the app
const app = express()

// setting default
app.set('view engine', 'ejs')

// setting up middleware
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))


// connecting to the database
let dbURI = 'mongodb+srv://boiwondah:boiwondah@boiwondah.7391b.mongodb.net/wordy?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(5000, () => {
    console.log('Server listening on port 5000...')
})
}).catch((error) => {
    console.log(error)
})

// Everything related to creating, reading, updating, and deleting posts
app.use('/posts', postRouter)

// homepage
app.use(mainRouter)


// about route
