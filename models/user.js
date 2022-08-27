const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    about: String,
    image: String,
    twitter: String,
    profession: String
}, 
{timestamps: true})

let User = mongoose.model('User', userSchema)

module.exports = { User }