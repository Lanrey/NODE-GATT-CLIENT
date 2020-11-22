import { config } from 'dotenv';
import appPath from 'app-root-path';
import multer from 'multer';
import s3Storage from 'multer-sharp-s3';
import aws from 'aws-sdk';
import path from 'path';
import { Buffer } from 'buffer';

config({ path: `${appPath}/.env` });

const BUCKET = process.env.AWS_DEV_BUCKET;
const REGION = process.env.AWS_DEV_REGION;

aws.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET,
  accessKeyId: process.env.AWS_S3_ACCESS,
  region: REGION
});

const s3 = new aws.S3();

const usersStorage = s3Storage({
  s3,
  Bucket: BUCKET,
  Key: `wellness-image/${Date.now()}`,
  // ACL: 'public.read',
  multiple: true,
  ignoreAspectRatio: true,
  resize: [{ suffix: 'mobile', width: 200, height: 200 }, { suffix: 'original' }]
});

const usersUpload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'));
    }

    cb(
      null,
      file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/png'
        || file.mimetype === 'multipart/form-data'
    );
  },

  storage: usersStorage
});

const uploadImage = (base64EncodedImage) => {
  // const bufImage = new Buffer(base64EncodedImage, 'base64');
  const bufImage = Buffer.from(base64EncodedImage, 'base64');

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: BUCKET,
        Key: `wellness-image/${Date.now()}`,
        ACL: 'public-read',
        Body: bufImage,
        ContentType: 'image/png',
        ContentEncoding: 'base64'
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.Location);
      }
    );
  });
};

export { usersUpload, uploadImage };
