'use strict';

const uuid = require('uuid/v4');
const validator = require('validator');

const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(
      typeof data.number_of_posts !== 'undefined' &&
      typeof data.days !== 'undefined' &&
      typeof data.time !== 'undefined' &&
      typeof data.bucket_id !== 'undefined' &&
      typeof data.type !== 'undefined' &&
      typeof data.user_id !== 'undefined' 
      ) {
        const days = data.days;
        if(days.length > 0 && days.length <= 7){
          resolve();
        }
    
    } else {
      reject({ code: 103.1, custom_message: 'Missing parent attribute.' });
    }
  })
}


module.exports.checkIfDaysAreaValid = (request_id, days) => {
  return new Promise((resolve, reject) => {
    days.forEach(day => {
      if(day === 'Sunday' || day === 'Monday' || day === 'Tuesday' || day === 'Wednesday'|| day === 'Thursday' || day === 'Friday'|| day === 'Saturday'){
        resolve();
      } else {
        reject({ code: 103.1, custom_message: 'Incorrect days format' });

      }
    })
  })
}


module.exports.specificReminderInit = (request_id, data) => {
  //step 1: check if any necessary attributes are null or undefined
  return new Promise((resolve, reject) => {
    if(
      typeof data.number_of_posts !== 'undefined' &&
      typeof data.day !== 'undefined' &&
      typeof data.time !== 'undefined' &&
      typeof data.bucket_id !== 'undefined' &&
      typeof data.type !== 'undefined' &&
      typeof data.user_id !== 'undefined' 
      ) {
        resolve();
    } else {
        reject({ code: 103.1, custom_message: 'Missing parent attribute.' });
    }
  })

}


// module.exports.specificReminderValidation = (request_id, data) => {  
//   return new Promise((resolve, reject) => {
//     //step 1: check if any necessary attributes are null or undefined
//     if(
//       data.number_of_posts > 0 &&
//       data.day >= 0 && data.day <= 6 &&
//       //data.time >=0 && data.time <=24 &&
//       data.type === 'weekly' || data.type === 'daily' || data.type == 'monthly'
//     ) {
//       resolve();
//     } else {
//       reject({code: 103.1, message: 'Parent attribution validation'})
//     }
  
//   })
// }

module.exports.insertIntoConfigTable = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const {number_of_posts, day, reminder_time, bucket_id, type, sub_type, user_id, bucket_name} = data;
    const config_id = uuid();

    const query = `INSERT INTO config_reminder SET ?;`;
    const query_body = {
      config_id,
      user_id,
      bucket_id,
      number_of_posts,
      day,
      reminder_time,
      type,
      bucket_name
    }

    try {
      let result = await mysql.query(request_id, db, query, [query_body]);
      if(result.affectedRows === 1) {
        resolve(config_id);
      } else {
        reject({ code: 103.3, message: 'Failure to insert into config_reminder table.'})
      }
    
    } catch(e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });

    }
  })
}

module.exports.insertIntoRemindersTable = (request_id, data) => {
  return new Promise(async (resolve, reject) => {
    const query = `INSERT INTO reminders SET ?;`;

    const reminder_id = uuid();
    const { config_id, bucket_id, post_id, user_id, email, reminder_date, reminder_time, reminder_timestamp_utc } = data;
    const query_body = {
      reminder_id,
      config_id,
      bucket_id, 
      post_id, 
      user_id, 
      email, 
      reminder_date,
      reminder_time,
      reminder_timestamp_utc
    };

    try {
      let result = await mysql.query(request_id, db, query, [query_body]);
      if(result.affectedRows === 1) {
        resolve(reminder_id);
      }
      else {
        reject({ code: 103.3, message: 'Failure to insert into reminders table.' })
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  })
}