'use strict';

const response = require(__base + '/app/modules/common/response');
const uuid = require('uuid/v4');

const infoModule = require(__base + '/app/modules/posts/info');
const postAddModule = require(__base + '/app/modules/posts/add');
const editPostModule = require(__base + '/app/modules/posts/edit');

const getImage = require(__base + '/app/modules/common/getImage');


module.exports.info = async (req, res) => {
  try {
    let body = req.query;
    let user_id = req.authInfo.user_id;
    
    let response_body = body;
    response_body.user_id = user_id;
    

    await infoModule.validation(req.request_id, response_body);
    await infoModule.postDetails(req.request_id, response_body)
    response.success(req.request_id, post, res);

  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}

//get list of posts inside child bucket
module.exports.postsInsideBucket = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    const bucket_id = req.query.id;
    const response_body = { user_id, bucket_id };

    await infoModule.postInsideBucketValidation(req.request_id, response_body);
    await postAddModule.checkIfBucketExists(req.request_id, response_body);
    const posts = await infoModule.getPostsForBucket(req.request_id, response_body);
    response_body.posts = posts;

    for(let i =0; i < posts.length; i++) {
      if(posts[i].type === 'image') {
        let post_id = posts[i].post_id;
        let image_urls = await getImage.getImageForPost({user_id, post_id});
        response_body.posts[i].image_urls = image_urls;
      }
   
    }
    
    delete req.temp; //remove any temp value set {post_id, fileValidationError}
    response.success(req.request_id, response_body, res);

  } catch(e) {
    response.failure(req.request_id, e, res);
  }
}

module.exports.addWithImage = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    const bucket_id = req.query.id;
    const post_id = uuid();
    const payload = {user_id, bucket_id, post_id}

    req.temp = { post_id };

    //get file name from s3 (file name is `timestamp-fileOriginalName`)
    await postAddModule.insertImageIntoS3Bucket(req.request_id, req, res);
    payload.content = post_id; //content of image post will be the post_id
    await postAddModule.validation(req.request_id, payload);
    await postAddModule.imageValidation(req.request_id, payload);

    const response_body = await postAddModule.insertIntoPostsTableWithImage(req.request_id, payload);
    delete req.temp; //remove any temp value set {post_id, fileValidationError}
    response.success(req.request_id, response_body, res);
 
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
}

module.exports.addWithText = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    let response_body = req.body;
    response_body.user_id = user_id;
    const { type, bucket_id, content } = response_body;

    const payload = {
      user_id,
      content,
      type,
      bucket_id,
    }

    await postAddModule.init(req.request_id, payload);
    await postAddModule.validation(req.request_id, payload);
    await postAddModule.checkIfBucketExists(req.request_id, payload);
    
    const post_id = await postAddModule.insertIntoPostsTableContainingText(req.request_id, payload);
    response.success(req.request_id, {post_id}, res);
 
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
}

//edits post created by image
module.exports.edit = async (req, res) => {
  try {

    let user_id = req.authInfo.user_id;
    let response_body = req.body;
    response_body.user_id = user_id;

    const { type, content, description, bucket_id, post_id } = response_body;
  
    await editPostModule.validation(req.request_id, response_body);
    await editPostModule.checkIfUserExists(req.request_id, user_id);
    await editPostModule.checkIfPostExists(req.request_id, response_body);

    const payload = {
      user_id,
      type,
      content,
      bucket_id,
      description,
      post_id,
      user_id_added_by: user_id
    }

    //edit posts table
    await editPostModule.editPostsTable(req.request_id, payload);
  
    //success
    response.success(req.request_id, response_body, res);
  } catch(e) {
    response.failure(req.request_id, e, res);
  }
 

}



