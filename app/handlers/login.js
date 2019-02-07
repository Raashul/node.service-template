'use strict';

const mysql = require(__base + "/app/modules/common/mysql");
const response = require(__base + '/app/modules/common/response');

const signupModule = require(__base + "/app/modules/registration/signup");
const loginModule = require(__base + "/app/modules/registration/login");

module.exports.login = async (req, res) => {
  try {
    const body = req.body;
    await loginModule.init(req.request_id, body);
    let user = await loginModule.checkUserExist(req.request_id, req.body.email);
    await loginModule.comparePassword( req.request_id, req.body.password, user.password);
    
    let token = await signupModule.generateToken(req.request_id, user);
    
    response.success(req.request_id, {token: token}, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
