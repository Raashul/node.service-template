'use strict';

const logger = require(__base + '/app/init/logger').logger;
const health = require(__base + '/app/init/logger').health;

module.exports.debug = (request_id, ...logging) => {
  if(logging.length === 0) {
    logger.debug(request_id);
  } else if(logging.length === 1) {
    logger.debug(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      logger.debug(log(request_id, logging[i]));
    }
  }
}

module.exports.info = (request_id, ...logging) => {
  if(logging.length === 0) {
    logger.info(request_id);
  } else if(logging.length === 1) {
    logger.info(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      logger.info(log(request_id, logging[i]));
    }
  }
}

module.exports.error = (request_id, ...logging) => {
  if(logging.length === 0) {
    logger.error(request_id);
  } else if(logging.length === 1) {
    logger.error(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      logger.error(log(request_id, logging[i]));
    }
  }
}

module.exports.warn = (request_id, ...logging) => {
  if(logging.length === 0) {
    logger.warn(request_id);
  } else if(logging.length === 1) {
    logger.warn(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      logger.warn(log(request_id, logging[i]));
    }
  }
}

module.exports.trace = (request_id, ...logging) => {
  if(logging.length === 0) {
    logger.trace(request_id);
  } else if(logging.length === 1) {
    logger.trace(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      logger.trace(log(request_id, logging[i]));
    }
  }
}

module.exports.healthOkay = (request_id, ...logging) => {
  health.info(log(request_id, 'Health check is okay.'));
}

module.exports.healthError = (request_id, ...logging) => {
  if(logging.length === 0) {
    health.error(request_id)
    logger.error(request_id);
  } else if(logging.length === 1) {
    health.error(log(request_id, logging[0]));
    logger.error(log(request_id, logging[0]));
  } else {
    for(let i = 0; i < logging.length; i++) {
      health.error(log(request_id, logging[i]));
      logger.error(log(request_id, logging[i]));
    }
  }
}

let log = (request_id, log) => {
  return `[${request_id}]: ${log}`;
}
