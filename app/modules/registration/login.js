const mysql = require(__base + "/app/modules/common/mysql");
const bcrypt = require("bcryptjs");

const db = "provisioning";

module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(data.email && data.password) {
      resolve();
    } else {
      reject({ code: 103.1, custom_message: 'Missing parent attribute.' });
    }
  })
}


module.exports.checkUserExist = (request_id, email) => {
  return new Promise(async (resolve, reject) => {
    let querystring = "SELECT * FROM users WHERE email = ?";
    try {
      let result = await mysql.query(request_id, db, querystring, email, null);
      if (result.length !== 1) {
        reject({ code: 103.3, custom_message: 'Email does not exist.' })

      } else {
        resolve(result[0]);
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.comparePassword = (request_id, password, userPassword) => {
  
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(password, userPassword, (err, matched) => { 
        if (err) {
          reject({ status: 102, message: "Internal Server error" });
        } else if (matched) {
          resolve();
        } else {
          reject({ code: 101, custom_message: "Password and confirm password does not match" });
        }
      });
    } catch(e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    } 
  });
};
