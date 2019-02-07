'use strict';

const jwt = require('jsonwebtoken');

const logger = require(__base + '/app/modules/common/logger');
const config = require(__base + '/app/config/config');
const response = require(__base + '/app/modules/common/response');

// const acl = require(`${__base}/app/routes/config/acl/acl`);

module.exports.authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const authInfo = await authenticateToken(req.request_id, token);
    // const authorizedEndpointRoles = await endpointAuthorization(req.request_id, req.method, req.route.path, authInfo);
    //logger.debug(req.request_id,`User: ${authInfo.user_id} successfully authorized.`);
    //authInfo.authorizedEndpointRoles = authorizedEndpointRoles;

    req.authInfo = authInfo;

    return next();

  } catch(e) {
    response.failure(req.request_id, e, res);
  }
};

function authenticateToken(request_id, token) {
  return new Promise( (resolve, reject) => {

    if (token) {
      logger.debug(request_id, `token is: ${token}`);
      jwt.verify(token, config.jwt.cert, (err, decoded) => {
        if (err) {
          logger.debug(request_id, `Failed to authenticate token - ${err.name}`, err);
          reject({ code: 105, custom_message: 'Failed to authenticate token' });
        } else {
            const authInfo = {
            token,
            tokenData: decoded,
            user_id: decoded.user_id,
            // roles: decoded.roles,
            exp: decoded.exp,
            iat: decoded.iat
          };

          resolve(authInfo);
        }
      });
    } else {
      logger.warn(request_id,'There is no token', token);
      reject({ code: 105, custom_message: 'Authentication Token not provided' });
    }
  });
}

// function endpointAuthorization(request_id, method, path, authInfo) {
//   return new Promise( async (resolve, reject) => {
//     const authorizedEndpointRoles = [];

//     authInfo.roles.forEach((role) => {
//       if(acl[role] && acl[role][method] && acl[role][method].includes(path)) {
//         authorizedEndpointRoles.push(role);
//       }
//     });

//     if (authorizedEndpointRoles.length > 0) {
//       resolve(authorizedEndpointRoles);
//     } else {
//       logger.debug(request_id,'Required application roles not available. Invalid User Roles');
//       reject({ code: 101, custom_message: 'Failed to authenticate token.' });
//     }
//   });
// }
