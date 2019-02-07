'use strict';

module.exports = {
  app: {
    port: process.env.PORT || 3001,
    environment: process.env.ENVIRONMENT || 'local'
  },
  passport : {
    clientID : process.env.PASSPORT_CLIENT_ID,
    clientSecret: process.env.PASSPORT_CLIENT_SECRET,
    callbackURL : process.env.PASSPORT_CALLBACK_URL
  },
  mysql: {
    provisioning_db_host: process.env.MYSQL_PROVISIONING_DB_HOSTNAME,
    provisioning_db_port: process.env.MYSQL_PROVISIONING_DB_PORT,
    provisioning_db_username: process.env.MYSQL_PROVISIONING_DB_USERNAME,
    provisioning_db_password: process.env.MYSQL_PROVISIONING_DB_PASSWORD,
    provisioning_db_database: process.env.MYSQL_PROVISIONING_DB_DATABASE,
    
    max_conn_limit: process.env.MYSQL_MAX_CONN_LIMIT
  },
  aws: {
    s3: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      postImageBucket: process.env.POST_IMAGE_BUCKET,
      //qrCodePath: 'qrcode',
      
      postImageBucketLocation: process.env.POST_IMAGE_BUCKET_LOCATION
    }
  },
  jwt: {
    cert: process.env.JWT_TOKEN_CERT
  }
};
