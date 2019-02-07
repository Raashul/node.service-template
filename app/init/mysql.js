"use strict";

const mysql = require("mysql");
const config = require(__base + "/app/config/config");
const logger = require(__base + "/app/modules/common/logger");

const provisioning = config.mysql.provisioning_db_database;
const promotion = config.mysql.promotion_db_database;
const profile = config.mysql.profile_db_database;
const query = "SELECT 1+1;";

/** Provisioning DB **/

const provisioningDBPool = mysql.createPool({
  host: config.mysql.provisioning_db_host,
  port: config.mysql.provisioning_db_port,
  user: config.mysql.provisioning_db_username,
  password: config.mysql.provisioning_db_password,
  database: config.mysql.provisioning_db_database,
  connectionLimit: parseInt(config.mysql.max_conn_limit),
  multipleStatements: true,
  waitForConnections: true,
  dateStrings: true,
  acquireTimeout: 30000
});

logger.info(
  `Database initialized - host: ${
    config.mysql.provisioning_db_host
  } database: ${config.mysql.provisioning_db_database} max-pool-conn: ${
    config.mysql.max_conn_limit
  }.`
);

module.exports.getprovisioningDBPool = () => {
  return provisioningDBPool;
};

provisioningDBPool.on("enqueue", connection => {
  logger.trace(`provisioningDBPool: Connection: Waiting.`);
});

//initConn(provisioning, this.getprovisioningDBPool());

/** End Provisioning DB **/

// function initConn(name, pool) {
//   pool.getConnection(function(err, connection) {
//     if(err) {
//       connection.release();
//       logger.error(`${name}: Error in connection: ${JSON.stringify(err)}`);
//     } else {
//       const sql = mysql.format(query, []);
//       connection.query(sql, function (error, results) {
//         connection.release();
//         if (error)
//           logger.error(`${name}: Error in connection: ${JSON.stringify(err)}`);
//       });
//     }

//     connection.on('error', function(err) {
//       logger.error(JSON.stringify(err));
//     });
//   });
// }
