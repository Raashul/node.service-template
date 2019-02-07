const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require(__base + '/app/config/config');
const passport = require('passport');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy({
    clientID: config.passport.clientID,
    clientSecret: config.passport.clientSecret,
    callbackURL: config.passport.callbackURL,
  },
    (token, refreshToken, profile, done) => {
      return done(null, {
          profile: profile,
          token: token
      });
  }));
};

module.exports.signUp = () => {
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    console.log('req is authenticated', req.isAuthenticated());
    console.log('sucess');
    res.send('Success login');

  }
}