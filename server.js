'use strict'

require('dotenv').config()
global.__base = __dirname;


const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const log4js = require('log4js');
const compression = require('compression');
const body_parser = require('body-parser');
const method_override = require('method-override');
const passport = require('passport');

//passport auth
const auth = require(__base + '/app/init/auth');

const app = express();

const { logger, http } = require(__base + '/app/init/logger');
const config = require(__base + '/app/config/config');

const request_id = require(__base + '/app/init/requestID').cuidRequestID;

app.use(body_parser.json());

// middlewares
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(method_override());
app.use(helmet());
app.use(request_id);
app.use(cors());
app.use(log4js.connectLogger(http, { level: 'auto' }));

//authenticate with passport
auth(passport);
app.use(passport.initialize());


// initialize - routes
require(__base + '/app/routes/index')(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (config.app.environment !== 'production') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// initializing
require(__base + '/app/init/mysql');

// start listening to port
var server = app.listen(config.app.port, () => {
  logger.info(`Node app started at: ${server.address().port}.`);
});

module.exports = server;
