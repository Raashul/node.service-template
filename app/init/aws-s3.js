'use strict';
const s3 = require('s3');

const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

let awsS3;

function initializeAWSS3(){
  return new Promise((resolve) => {
    logger.info(`Initilizing S3 connection`);

    awsS3 = s3.createClient({
      maxAsyncS3: 20,
      s3RetryCount: 3,
      s3RetryDelay: 1000,
      multipartUploadThreshold: 20971520,
      multipartUploadSize: 15728640,
      s3Options: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
        region: config.aws.s3.qrCodeBucketLocation
      }
    });
  });
}

initializeAWSS3();

module.exports.getS3 = () => {
  return s3;
};

module.exports.getS3Client = () => {
  if (!awsS3) {
    initializeAWSS3();
  }

  return awsS3;
};
