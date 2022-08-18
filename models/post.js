const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true})

let Post = mongoose.model('Post', postSchema)

module.exports = { Post }