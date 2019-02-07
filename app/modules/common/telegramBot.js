'use strict';

const request = require('request');

const logger = require(__base + '/app/modules/common/logger');
const config = require(__base + '/app/config/config');

module.exports.send = (request_id, message) => {
  try {
    if(config.telegram.bot) {
      let telegram_bot_body =   {
        "text": message
      }

      logger.debug(request_id, `Telegram payload: ${JSON.stringify(telegram_bot_body)}.`);

      request.post({
        url: config.telegram.bot,
        json: telegram_bot_body
      }, (error, response, body) => {
        logger.debug(request_id, `Telegram message success.`);
      });
    }
  } catch(e) {
    logger.warn(request_id, e.message, e.stack, JSON.stringify(e));
  }
};