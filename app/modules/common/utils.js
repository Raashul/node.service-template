'use strict';

const moment = require('moment');
const voucher_codes = require('voucher-code-generator');

const mysql = require(__base + '/app/modules/common/mysql');
const add_credit_duration = require(__base + '/app/datatype/add_credit').duration;
const dashboard_state = require(__base + '/app/datatype/dashboard_states').state;
const dashboard_version = require(__base + '/app/datatype/dashboard_states').version;

const profile_db = 'profile';

module.exports.verify = (...args) => {
  for (let i = 0; i < args.length; i++) {
    console.log('-' +args[i] +'-')
    if(!args[i])
      return false;
  }
  return true;
};

module.exports.addToTransactionsHistory = (request_id, customer_id, merchant_id, type, json_body) => {
  return new Promise( async (resolve, reject) => {
    const query = "INSERT INTO `transactions_history` SET ?;"
    const query_body = {
      customer_id: customer_id,
      merchant_id: merchant_id,
      type: type,
      json: json_body 
    };

    try {
      let result = await mysql.query(request_id, profile_db, query, [query_body]);
      if(result.affectedRows === 1)
        resolve(result);
      else {
        reject({ code: 103.4, message: 'Failure to insert.' });
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.getDateTimeAfter = (duration) => {
  if(duration && add_credit_duration.indexOf(duration) > -1) {
    return moment().add(duration[0], duration[1]).format("YYYY-MM-DD");
  } else {
    return null;
  }
};

module.exports.getVoucherCode = () => {
  return voucher_codes.generate({
    length: 8,
    count: 1
  })[0].toUpperCase();
};

module.exports.insertIntoDashboardHistory = (request_id, customer_id, version, previous_state, new_state) => {
  return new Promise( async (resolve, reject) => {
    const query = "INSERT INTO `dashboard_states_history` SET ?;"

    const query_body = {
      customer_id: customer_id,
      version: version,
      previous_state: previous_state,
      new_state: new_state
    };

    try {
      let result = await mysql.query(request_id, profile_db, query, [query_body]);
      if(result.affectedRows === 1)
        resolve();
      else {
        reject({ code: 103.3, message: 'Failure to insert into dashboard_state_history.' })
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
}

