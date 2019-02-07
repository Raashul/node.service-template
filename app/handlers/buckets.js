'use strict';

const response = require(__base + '/app/modules/common/response');
const addModule = require(__base + '/app/modules/buckets/add');
const infoModule = require(__base + '/app/modules/buckets/info');

//generate  buckets
module.exports.add = async (req, res) => {
  try {
    console.log('here', req.body);
    const body = req.body;
    const user_id = req.authInfo.user_id;
    let response_body = req.body;
    response_body.user_id = user_id;

    await addModule.init(req.request_id, response_body);
    await addModule.validation(req.request_id, response_body);
    await addModule.checkIfBucketAlreadyExists(req.request_id, response_body);    
    const bucket_id = await addModule.insertIntoBucketsTable(req.request_id, response_body);
    
    response_body.bucket_id = bucket_id;

    response.success(req.request_id, response_body, res);

  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}

//get posts from bucket
module.exports.get = async (req, res) => {
  try {
    const bucket_id = req.query.id;
    const user_id = req.authInfo.user_id;
    let response_body = {
      bucket_id, user_id
    }

    await infoModule.validation(req.request_id, response_body);
    //await infoModule.checkIfBucketExists(req.request_id, response_body);  
    const buckets = await infoModule.getSecondaryBucketsIfExists(req.request_id, response_body);
    
    let numberOfPosts = [];
    let promiseArray = [];

    Promise.all(
      buckets.map(async function(b) { 
        let bucketId = b.bucket_id;
        const c = await infoModule.checkCountForBucketPost(req.request_id, {bucketId, user_id});
        numberOfPosts.push({
          bucket_id: bucketId,
          bucket_name: b.bucket_name,
          count : c
        });
      })
    ).then(function() {
      response_body.numberOfPosts = numberOfPosts;
      response_body.buckets = buckets;

      response.success(req.request_id, response_body, res);
    })
    
  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}



//get child bucket
module.exports.getChildBuckets = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    let response_body = {
      user_id,
      type : 'child'
    }

    //await infoModule.checkIfBucketExists(req.request_id, response_body);  
    const buckets = await infoModule.getAllChildBuckets(req.request_id, response_body);
    response.success(req.request_id, {buckets}, res);
        
  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}



//get all buckets by type
module.exports.getBucketsByType = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    let response_body = {
      user_id,
    }

    const parent_buckets = await infoModule.getAllParentBuckets(req.request_id, response_body);
    const child_buckets = await infoModule.getAllChildBuckets(req.request_id, response_body);
    response_body.parent_buckets = parent_buckets;
    response_body.child_buckets = child_buckets;

    response.success(req.request_id, response_body, res);
        
  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}



