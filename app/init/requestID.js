'use strict';

const uuid = require('uuid/v4');
var cuid = require('cuid');

module.exports.requestID = (req, res, next) => {
  req.request_id = uuid();
  next();
};

module.exports.cuidRequestID = (req, res, next) => {
  req.request_id = cuid();
  next();
};
