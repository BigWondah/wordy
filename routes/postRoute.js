const express = require('express');
// const { Post } = require('../models/post')
const postController = require('../controllers/postController')

const postRouter = express.Router()


// publishing new post - fist get the page
postRouter.get('/new_post', postController.get_new_post_form)

// publish new post
postRouter.post('/new_post', postController.publish_new_post)

// retrieving single post
postRouter.get('/read/:id', postController.get_single_post)

// updating a post - first get
postRouter.get('/update_post/:id', postController.get_update_post_form)

// updating  a post - second put
postRouter.post('/update_post/:id', postController.update_single_post);

// delet a blog
postRouter.delete('/delete_post/:id', postController.delete_single_post)

module.exports = { postRouter }