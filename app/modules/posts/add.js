'use strict';

const uuid = require('uuid/v4');
const validator = require('validator');

const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');
const upload = require(__base + '/app/modules/common/fileUpload');

//create single image upload instance for multer
const singleUpload = upload.single('image');


const db = 'provisioning';


module.exports.init = (request_id, data) => {

  return new Promise( (resolve, reject) => {
    if (
      typeof data.content !== 'undefined' && 
      typeof data.type !== 'undefined' &&
      typeof data.bucket_id !== 'undefined' &&
      typeof data.user_id !== 'undefined' 
    ) {
      if(data.content.length != 0 && data.type == 'text' && data.bucket_id != null && data.user_id != null ) {
        resolve();
      }    
      else {
        reject({ code: 103.1, message: 'Missing children attribute.' });
      }
    } 
    else {
      reject({ code: 103.1, message: 'Missing parent attribute.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(validator.isUUID(data.user_id)){
      logger.info(request_id, data.user_id);
      resolve();
    } else {
      reject({ code: 103, message: 'Attributes validation incorrect. Not UUID' });
    }
  })
}

module.exports.checkIfBucketExists = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM buckets WHERE user_id_added_by = ? AND bucket_id = ?;`;
    try {
      let result = await mysql.query(request_id, db, query, [data.user_id, data.bucket_id]);
      if(result.length > 0) {
          resolve();
      } else {
        reject({ code: 103, custom_message: 'No buckets with this bucket id or with the user id.' })
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}


module.exports.checkIfUserExists = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM users WHERE user_id = ?;`;
    try {
      let result = await mysql.query(request_id, db, query, [user_id]);
      if(result.length === 1) {
          resolve();
      } else {
        reject({ code: 103, custom_message: 'User does not exist.' })
      }
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  })
}


module.exports.getType = (request_id, data) => {
  return new Promise((resolve, reject) => {
    try {
      if(data.type == 'image'){
        resolve('image');
      } else {
        resolve('text');
      }
      
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }
  })
}


module.exports.insertImageIntoS3Bucket = (request_id, req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      singleUpload(req, res, async (err, some) =>  {
        if (err) {
          logger.error(err);
          reject({code: 103.3, message: 'Failure to insert photo.'});
        } 
        else if(req.temp.fileValidationError ) {
          reject({ code: 103.3, custom_message: 'Incorrect file format.' })
        } 
        else {
          resolve();
        }
      })
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }

  })
}


module.exports.insertIntoPostsTableWithImage = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {

    const query = `INSERT INTO posts SET ?;`;
    const query_body = {
      post_id: payload.post_id, 
      user_id : payload.user_id, 
      bucket_id : payload.bucket_id,
      type : 'image',
      content  : null,
      description : null
    }

    try {
      let result = await mysql.query(request_id, db, query, [query_body]);
      if(result.affectedRows === 1) {
        resolve(query_body);
      } else {
        reject({ code: 103.3, message: 'Failure to insert into posts.' })
      }
    
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }
  })
}



module.exports.insertIntoPostsTableContainingText = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const post_id = uuid();
    const { type, bucket_id, content, user_id } = data;
    const query = `INSERT INTO posts SET ?;`;
    const query_body = {
      post_id, 
      user_id ,
      bucket_id,
      type, 
      content,
      description : null
    }

    try {
      let result = await mysql.query(request_id, db, query, [query_body]);
      if(result.affectedRows === 1) {
        resolve(post_id);
      } else {
        reject({ code: 103.3, message: 'Failure to insert into posts table.' })
      }
    
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }
  })
}