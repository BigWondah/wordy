const { User } = require('../models/user');

const loginRequired = async(req, res, next) => {
  if(req.session && req.session.user) {
    const user = await User.findById(req.session.user._id);
    if(!user) {
      // if user not found
      req.flash('error', 'You need to sign in first')
      return res.redirect('/auth/login')
    }
    // if user found
    req.user = user
    return next();
  }
  // if no user in session
  req.flash('error', 'You Need To login First');
  return res.redirect('/auth/login')

}

const logoutRequired = (req, res, next) => {
  if(req.session && req.session.user) {
    // if user in session 
    return res.redirect(`/auth/dashboard/${req.session.user._id}`)
  }
  // if user not in session
  return next();
}

module.exports = { loginRequired, logoutRequired }