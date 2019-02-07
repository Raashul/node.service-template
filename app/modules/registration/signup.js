'use strict';

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require(__base + '/app/modules/common/mysql');
// const logger = require(__base + '/app/modules/common/logger');
const config = require(__base + '/app/config/config');


// const salt_rounds = 10;
const db = 'provisioning';

//registration modules

module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(data.username && data.first_name && data.last_name && data.email && data.password && data.confirm_password) {
      resolve();
    } else {
      reject({ code: 103.1, custom_message: 'Missing parent attribute.' });
    }
  })
}


module.exports.validation = (request_id, data) => {
  return new Promise( (resolve, reject) => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if((email_regex.test(String(data.email).toLowerCase())) &&
      (data.first_name.trim() !== '' && data.first_name.length < 255) &&
      (data.last_name.trim() !== '' && data.last_name.length < 255)
    ) {
      resolve();
    } else {
      reject({ code: 103.2, message: 'Attributes validation incorrect.' });
    }
  });
};


module.exports.checkIfEmailExists = (request_id, data) => {
  return new Promise( async (resolve, reject) => {
    const query = `SELECT GET_LOCK(?, 7); SELECT email FROM users WHERE email = ?;`;

    try {
      let result = await mysql.query(request_id, db, query, [data.email, data.email]);
      if(result[1].length === 0)
        resolve();
      else {
        reject({ code: 103.3, custom_message: 'User with same email already available.' })
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.insertIntoUsersTable = (request_id, data) => {
  return new Promise( async (resolve, reject) => {
    const user_id = uuid();
    const { email, first_name, last_name } = data; 
    const query = `SELECT RELEASE_LOCK(?); INSERT INTO users SET ?;`
    const query_body = {
      user_id: user_id, 
      email, 
      first_name, 
      last_name
    };

    try {
      let result = await mysql.query(request_id, db, query, [data.email, query_body]);
      if(result[1].affectedRows === 1){
        resolve(query_body);
      } else {
        reject({ code: 103.4, message: 'Failure to insert.' })
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};


//generate jwt token
module.exports.generateToken = async (request_id, data) => {
  return new Promise (async (resolve, reject) => {
    try {
      let payload = {
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      }
      let token = await jwt.sign(payload, config.jwt.cert);
      resolve(token);
    } catch(e){
      reject({ code: 102, message: { message: e.message } });
    }
  })
}

// Registration for the local authentication
module.exports.initLocal = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if (data.first_name && data.last_name && data.email && data.password) {
      resolve();
    } else {
      reject({ code: 102, message: "Missing parent attribute" });
    }
  });
};

// Local Strategy for password check
module.exports.passwordcheck = (request_id, data) => {
  const { password, confirm_password } = data;
  return new Promise((resolve, reject) => {
    if (password === confirm_password) {
      resolve();
    } else {
      reject({ code: 101, custom_message: "Password and confirm password does not match" });
    }
  });
};

// Hash Password
module.exports.hashpassword = async (request_id, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) 
      reject({ status: 102, message: "Internal Server error" });
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject({ status: 102, message: "Internal Server error" });
        resolve(hash);
      });
    });
  });
};

// User table insertion for local auth
module.exports.insertIntoUsersTableLocal = (request_id, password, data) => {
  return new Promise(async (resolve, reject) => {
    const user_id = uuid();
    const { email, first_name, last_name, username } = data;
    const query = `SELECT RELEASE_LOCK(?); INSERT INTO users SET ?;`;
    const query_body = {
      user_id: user_id,
      email,
      password,
      first_name,
      last_name,
      username
    };

    try {
      let result = await mysql.query(request_id, db, query, [
        data.email,
        query_body
      ]);

      if (result[1].affectedRows === 1) {
        resolve(query_body);
      } else {
        reject({ code: 103.4, message: "Failure to insert." });
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};
