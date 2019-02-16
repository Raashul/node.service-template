'use strict';

const response = require(__base + '/app/modules/common/response');

const signup = require(__base + "/app/modules/registration/signup");
const signUpModule = require(__base + '/app/modules/registration/signup');

module.exports.signup = async (req, res) => {
  let user = req.body;
  try {
    await signup.initLocal(req.request_id, user);
    await signup.validation(req.request_id, user);
    await signup.passwordcheck(req.request_id, user);
    await signup.checkIfEmailExists(req.request_id, user);
    let hashpassword = await signup.hashpassword(req.request_id, user.password);
    user =  await signup.insertIntoUsersTableLocal(req.request_id, hashpassword, user);
  
    let token = await signUpModule.generateToken(req.request_id, user); 
    response.success(req.request_id, {token: token}, res);  
  
  } catch (e) {
    response.failure(req.request_id, e, res);
  } 
};
