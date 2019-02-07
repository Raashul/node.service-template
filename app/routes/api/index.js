'use strict';

const  passport = require('passport');

// const health = require(__base + '/app/handlers/health')
// const logger = require(__base + '/app/modules/common/logger');
const route = require(__base + '/app/routes/config/constants');

const home = require(__base + '/app/handlers/home');
const registration = require(__base + '/app/handlers/registration');
const posts = require(__base + '/app/handlers/posts');
const buckets = require(__base + '/app/handlers/buckets');
const reminders = require(__base + '/app/handlers/reminders');
const localSignUp = require(__base + "/app/handlers/localSignup");

const authorization = require(__base + '/app/routes/config/authorization');
const login = require(__base + "/app/handlers/login");

exports = module.exports = (app) => {

  // health checks
  //app.get('/', health.check);
  // app.get('/health', health.check);

  app.get('/', (req, res) => res.send('this is working..... :) '))

  // google registration
  app.get(route.googleSignUp, passport.authenticate('google', {
    scope : ['profile', 'email'] 
  }));
  app.get(route.googleCallback, passport.authenticate('google', {failureRedirect: '/'}), registration.googleSignUp)

  // local registration
  app.route(route.localSignup).post(localSignUp.signup);

  // local login
  app.route(route.login).post(login.login);

  //home route
  app.get(route.home, authorization.authCheck, home.info);

  //get post
  app.route(route.post)
    .get(authorization.authCheck, posts.info);

  //add post with image
  app.route(route.addPostWithImage)
    .post(authorization.authCheck, posts.addWithImage);

  //add post with text
  app.route(route.addPostWithText)
    .post(authorization.authCheck, posts.addWithText);


  //edit post
  app.route(route.editPost)
    .post(authorization.authCheck, posts.edit);

  //bucket routes
  app.route(route.bucket)
    .get(authorization.authCheck, buckets.get)
    .post(authorization.authCheck, buckets.add);

  //get child buckets
  app.route(route.childBuckets)
    .get(authorization.authCheck, buckets.getChildBuckets);

  //get all buckets by type
  app.route(route.bucketByType)
    .get(authorization.authCheck, buckets.getBucketsByType);

  //Reminder routes

  //Specific reminder routes  
  app.route(route.specificReminder)
    .post(authorization.authCheck, reminders.addSpecificReminder);

  app.route(route.reminders)
    .get(authorization.authCheck, reminders.getAllReminders)

  // logger.info(`Routes initialized.`)
};
