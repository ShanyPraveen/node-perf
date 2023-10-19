const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const { clientId, clientSecret } = require('../config/keys');
const mongoose = require("mongoose");
const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(new GoogleStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshtoken, profile, done) => {
  User.findOne({googleId: profile.id}).then((existingUser) => {
    if (existingUser) {
      done(null, existingUser)
    } else {
      new User({googleId: profile.id}).save().then((user) =>{
        done(null, user)
      })
    }
  })
}))
