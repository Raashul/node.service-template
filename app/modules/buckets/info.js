'use strict';

const validator = require('validator');
const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';



module.exports.validation = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(data.bucket_id === 'null' || typeof data.bucket_id === 'undefined'){
      reject({ code: 103, custom_message: 'Bucket id not provided.' });
    }
    else if(validator.isUUID(data.user_id)){
      logger.info(request_id, data.user_id);
      resolve();
    } else {
      reject({ code: 103, message: 'Attributes validation incorrect. Not UUID' });
    }
  })
}


module.exports.checkIfBucketExists = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ?;`;
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id]);
      if(result.length > 0) {
          resolve();
      } else {
        reject({ code: 103, custom_message: 'No buckets for that user.' })
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}


module.exports.getSecondaryBucketsIfExists = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ? AND parent_bucket_id = ?;`;
    logger.info('getSecondaryBuckets', query);
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id, data.bucket_id]);
      if(result.length >= 0) {
          resolve(result);
      } else {
        reject({ code: 103, custom_message: 'No secondary buckets for this parent bucket.' });
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}

//count of posts inside bucket
module.exports.checkCountForBucketPost = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND bucket_id = ?;`;

    logger.info(query)
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id, data.bucketId]);
      if(result) {
        resolve(result[0].count);
      } else {
        reject({ code: 104, custom_message: 'No more buckets for this bucket.' })
      }
    } catch (e) {
      reject({ code: 104, message: { message: e.message, stack: e.stack } });
    }
  })
}


module.exports.getAllChildBuckets = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const type = 'child'
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ? AND type = ?;`;
    logger.info('getSecondaryBuckets', query);
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id, type]);
      if(result.length >= 0) {
          resolve(result);
      } else {
        reject({ code: 103, custom_message: 'No child buckets for this user.' });
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}


module.exports.getAllParentBuckets = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const type = 'parent'
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ? AND type = ?;`;
    logger.info('getSecondaryBuckets', query);
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id, type]);
      if(result.length >= 0) {
        resolve(result);
      } else {
        reject({ code: 103, custom_message: 'No parent buckets for this user.' });
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}