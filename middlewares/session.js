const session = require('express-session');
const MongoStore = require('connect-mongo');


const newSession = session({
  secret: 'secretdev',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
})



module.exports = { newSession };