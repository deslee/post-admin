import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import fs from 'fs'
import AWS from 'aws-sdk';
import globalConfig from '../../globalConfig'
import uuid from 'uuid/v4';
import mime from 'mime-types';

const awsCredentials = new AWS.Credentials(globalConfig.awsAccessKey, globalConfig.awsSecretAccessKey);

export async function resolveUpload(upload: any) {
  const { filename, mimetype, encoding, createReadStream } = upload;
  const stream = createReadStream();
  // Save file 
  const key = await saveRemote(stream, mimetype);
  // Return metadata to save it to Postgres
  return key;
}

function saveRemote(stream: fs.ReadStream, mimetype: string): Promise<string> {
  const extension = mime.extension(mimetype);
  if (!extension) {
    throw "Unrecognized mimetype " + mimetype;
  }
  const key = `${uuid()}.${extension}`;
  var s3Obj = new S3({ credentials: awsCredentials })
  return new Promise((resolve, reject) =>
    s3Obj.upload({ Body: stream, Bucket: globalConfig.awsS3UploadBucket, Key: key, ContentType: mimetype }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(key);
      }
    })
  );
}