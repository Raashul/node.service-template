'use strict';

const response = require(__base + '/app/modules/common/response');

const infoModule = require(__base + '/app/modules/home/info');

module.exports.info = async (req, res) => {
  try {
    let response_body;
    const user_id = req.authInfo.user_id;
    let payload = {
      user_id
    }
    await infoModule.validation(req.request_id, payload);
    const buckets = await infoModule.checkPrimaryBucketsForThatUser(req.request_id, payload);

    response.success(req.request_id, {buckets}, res);

  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}





