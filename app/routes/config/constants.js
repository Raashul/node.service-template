'use strict';

const routes = {
  localSignup: '/api/local/signup',
  login: '/api/local/login',
  googleSignUp: '/auth/google',
  googleCallback: '/auth/google/callback',
  home: '/api/home',
  bucket: '/api/bucket',
  childBuckets: '/api/buckets/child',
  bucketByType :  '/api/buckets/type',
  postInsideBucket: '/api/posts/bucket',
  post: '/api/post',
  addPostWithText: '/api/post/add/text',
  addPostWithImage: '/api/post/add/image',
  editPost: '/api/post/edit',
  add: '/api/add',
  reminders: '/api/reminders',
  specificReminder: '/api/reminder/specific'
};

module.exports = routes;
