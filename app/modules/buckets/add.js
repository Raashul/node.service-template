'use strict';

const uuid = require('uuid/v4');

const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';



module.exports.init = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    if(data.bucket_name && data.type !== 'undefined'){
      resolve();
    } else {
      reject({ code: 103.1, message: 'Missing parent attribute.' });
    }
  })
}


module.exports.validation = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    if(typeof data.bucket_name !== "undefined" && data != null && data.bucket_name.length !== 0){
      if(data.type == 'parent' || data.type == 'child')
        resolve();
    } else {
      reject({ code: 103.1, message: 'Invalid parent attribute.' });
    }
  })
}

module.exports.checkIfBucketAlreadyExists = (request_id, data) => {
  return new Promise( async (resolve, reject) => {
    const query = `SELECT * FROM buckets WHERE bucket_name = ? AND user_id_added_by = ?;`;

    try {
      let result = await mysql.query(request_id, db, query, [data.bucket_name, data.user_id]);
      if(result.length === 0)
        resolve();
      else {
        reject({ code: 103.4, custom_message: 'Bucket with same name already exists.' })
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
}


module.exports.insertIntoBucketsTable = (request_id, data) => {
 return new Promise(async (resolve, reject) => {
    const bucket_id = uuid();

    //check if parent bucket exists. or set null
    const parent_bucket_id = data.parent_bucket_id ? data.parent_bucket_id : null ; 
    const user_id_added_by = data.user_id;
    const { bucket_name, description, type } = data;

    const query = 'INSERT INTO buckets SET ?';

    const query_body = { bucket_id, bucket_name, parent_bucket_id, user_id_added_by, description, type };

    try {
      let result = await mysql.query(request_id, db, query, [query_body]);
      if(result.affectedRows === 1) {
        console.log('resolving');
        resolve(bucket_id);
      } else {
        reject({ code: 103.3, message: 'Failure to insert into bucket.' })
      }
    
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }

 })
}