// 'use strict';

// const logger = require(__base + '/app/modules/common/logger');
// const mysql = require(__base + '/app/modules/common/mysql');

// const profile_db = 'profile';
// const provisioning_db = 'provisioning'
// const promotion_db = 'promotion';

// module.exports.check = async function (req, res) {
//   const query = `SELECT 1+1;`;
//   try {
//     const [result1, result2, result3] = await Promise.all([mysql.query(req.request_id, profile_db, query, [], false), mysql.query(req.request_id, provisioning_db, query, [], false), mysql.query(req.request_id, promotion_db, query, [], false)]);
//     logger.healthOkay(req.request_id);
//     res.status(200).send('OK');
//   } catch (e) {
//     logger.healthError(req.request_id, e.message, e.stack);
//     res.status(500).send('ERROR');
//   }
// };
