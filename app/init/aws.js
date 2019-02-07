'use strict';

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

let s3 = null;

function initializeAWS_SDK_S3 () {
  logger.debug(`Initializing AWS`);

  AWS.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey,
    region: config.aws.s3.postImageBucketLocation
  });


  s3 = new AWS.S3();
}

initializeAWS_SDK_S3();

module.exports.getS3 = () => {
  if (!s3){
    initializeAWS_SDK_S3();
  }

  return s3;
};
