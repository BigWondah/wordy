const express = require('express');
// const { Post } = require('../models/post')
const authRouter = express.Router()
const authController = require('../controllers/authController')
const { loginRequired, logoutRequired } = require('../middlewares/auth');


// rendering the register page
authRouter.get('/register', logoutRequired, authController.renderRegisterUser)
authRouter.post('/register', logoutRequired, authController.registerUser);
authRouter.get('/login', logoutRequired, authController.renderLoginUser);
authRouter.post('/login', authController.loginUser);
authRouter.get('/dashboard/:userId', authController.renderDashboard);

authRouter.get('/logout', loginRequired, authController.logoutUser );

authRouter.post('/update', loginRequired, authController.updateProfile);
authRouter.post('/update/password', loginRequired, authController.updatePassword);

module.exports = { authRouter }