var AWS = require('aws-sdk')
AWS.config.update({region: 'us-west-2'});

var fs = require('fs')

var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var bucket = 'casting-complex'

async function createUserAlbum (userId) {
  var albumName = 'User' + userId
  var albumKey = encodeURIComponent(albumName) + '/';
  
  try {
    await s3.headObject({Bucket: bucket, Key: albumKey}).promise()
    return albumName
  } catch (e) {
    if (e.code === 'NotFound') {
      await s3.putObject({Bucket: bucket, Key: albumKey}).promise()
      return albumName
    } else {
      throw new Error(e)
    }
  }
}

async function uploadProfilePhotoToS3(userId, file) {
  try {
    var albumName = await createUserAlbum(userId)
  } catch (e) {
    throw new Error(e)
  }
  var re = /(?:\.([^.]+))?$/;
  var fileExtension = re.exec(file.originalname)
  var albumKey = encodeURIComponent(albumName) + '/';
  var avatarKey = albumKey + 'avatar' + fileExtension[0]

  var fileObj = fs.readFileSync(file.path)
  var base64file = new Buffer(fileObj, 'binary')
  
  return s3.upload({
    Bucket: bucket,
    Key: avatarKey,
    Body: base64file,
    ACL: 'public-read'
  }).promise().then(res => {
    return res.Location
  }).catch(err => {
    throw new Error(err)
  })
}

async function uploadPhotosToS3(userId, files) {
  try {
    var albumName = await createUserAlbum(userId)
  } catch (e) {
    throw new Error(e)
  }
  
  var albumKey = encodeURIComponent(albumName) + '/';

  var paths = []

  for (var file of files) {

    var fileObj = fs.readFileSync(file.path)
    var base64file = new Buffer(fileObj, 'binary')

    var photoKey = albumKey + file.originalname

    try {
      var res = await s3.upload({
        Bucket: bucket,
        Key: photoKey,
        Body: base64file,
        ACL: 'public-read'
      }).promise()
      paths.push(res.Location)
    } catch (e) {
      throw new Error(e)
    }
  }
  return paths
}

async function deleteFromS3 (userId, objKey) {
  try {
    var key = 'User' + userId + '/' + objKey
    var params = { Bucket: bucket, Key:  key};
    var res = await s3.deleteObject(params).promise()
    console.log(res)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { deleteFromS3, uploadProfilePhotoToS3, uploadPhotosToS3 }