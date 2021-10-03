const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
});

exports.awsImageUploader = (file, filename) => {
  var { buffer, mimetype } = file;
  var awsParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: mimetype,
  };
  return new Promise((resolve, reject) => {
    S3.upload(awsParams, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};
