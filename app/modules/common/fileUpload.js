const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = require(__base + '/app/init/aws').getS3();
const config = require(__base + '/app/config/config');


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.s3.postImageBucket,
    // acl: 'public-read',
    metadata:  (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) =>  {
      cb(null, `images/${req.authInfo.user_id}/${req.temp.post_id}/${Date.now().toString()}-${file.originalname}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
      cb(null, true);
    } else {      
      req.temp.fileValidationError = 'Something wrong with file format';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
  }
})

module.exports = upload;
