'use strict';

const validator = require('validator');
const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';


module.exports.getAllRemindersForUser = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT bucket_id, bucket_name, type, day, number_of_posts FROM config_reminder WHERE user_id = ?;`;
    logger.info('getAllReminders', query);
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id]);
      if(result.length >= 0) {
        resolve(result);
      } 
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}