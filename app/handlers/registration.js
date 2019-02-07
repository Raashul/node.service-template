'use strict';

const  passport = require('passport');
const signUpModule = require(__base + '/app/modules/registration/signup');
const response = require(__base + '/app/modules/common/response');



module.exports.googleSignUp = async (req, res) => {

  try{
    const {id, provider, emails, name, photos} = req.user.profile;
    const data = {
      first_name: name.givenName,
      last_name : name.familyName,
      email: emails[0].value,
    }

    await signUpModule.init(req.request_id, data);
    await signUpModule.validation(req.request_id, data);

    await signUpModule.checkIfEmailExists(req.request_id, data);
    let user = await signUpModule.insertIntoUsersTable(req.request_id, data);
    let token = await signUpModule.generateToken(req.request_id, user); 

    response.success(req.request_id, {token: token}, res);
  } 
  catch(e) {
    response.failure(req.request_id, e, res);
  }
  
}