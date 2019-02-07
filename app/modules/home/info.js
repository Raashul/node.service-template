'use strict';

const validator = require('validator');
const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';

module.exports.validation = (request_id, data) => {
  return new Promise((resolve, reject) => {
    resolve();
    if(validator.isUUID(data.user_id)){
      logger.info(request_id, data.user_id);
      resolve();
    } else {
      reject({ code: 103, message: 'Attributes validation incorrect. Not UUID' });
    }
  })
}

module.exports.checkPrimaryBucketsForThatUser = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ? AND parent_bucket_id IS NULL ORDER BY created_at DESC;`;
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id]);
      if(result.length > 0) {
          resolve(result);
      } else {
        reject({ code: 103, custom_message: 'No buckets for that user.' })
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}

