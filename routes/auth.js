const passport       = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require('../models/user');
require("dotenv").config();

passport.serializeUser(function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj, cb) { cb(null, obj);  });

passport.use(new GitHubStrategy({
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const {
        id: githubId, 
        name, 
        login: username, 
        email, 
        avatar_url: avatar
    } 
    = profile._json;

    const newUser = new User({
      token: accessToken,
      githubId,
      name,
      username,
      email,
      avatar
    });

    User.find({'githubId': githubId}, (err, userCheck)=> {
        if (err) { res.status(500).send('Something broke!') }
        if (!userCheck.length) {
            newUser.save(newUser, (err) => {
                return done(err, newUser);
            })
          }
        else {return done(err, newUser);}
    })
}
));

module.exports = passport;
