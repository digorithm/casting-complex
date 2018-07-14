var S3 = require('../S3')

uploadProfilePhotoToS3 = S3.uploadProfilePhotoToS3
uploadPhotosToS3 = S3.uploadPhotosToS3
deleteFromS3 = S3.deleteFromS3

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var fs = require('fs')
var multer  = require('multer')
const path = require('path');

var VerifyToken = require('./verify_token');

var utils  = require('../utils')

var ReE = utils.ReE;
var ReS = utils.ReS;
var ErrorMessage = utils.ErrorMessage;

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


var avatarUpload = multer({ storage: avatarStorage })
var albumUpload = multer({ storage: photoStorage })


router.get('/', async function(req, res) {

  var username = req.query.username;
  
  if (username !== 'undefined' && username ) {
    user = await models.User.findOne({
      where: { username: username }
    });
    
    if (user == null) {
      return ReE(res, 'User not found', 404)
    }
    
    var userJson = await user.buildResponse();
    return ReS(res, {data: userJson}, 200)
  }

  var email = req.query.email;

  if (email !== 'undefined' && email ) {
    user = await models.User.findOne({
      where: { email: email }
    });
    
    if (user == null) {
      return ReE(res, 'User not found', 404)
    }
    
    var userJson = await user.buildResponse();
    return ReS(res, {data: userJson}, 200)
  }

  var users = await models.User.findAll()
  
  userJsonPromises = [];
  for (user of users) {
    userJsonPromise = user.buildResponse();
    userJsonPromises.push(userJsonPromise);
  }

  Promise.all(userJsonPromises).then(usersJson => {
    return ReS(res, {data: usersJson}, 200);
  });
});

// TODO: endpoint to check if username or email is unique. Make it two optional query string in the previous endpoint!

router.get('/:user_id', async function (req, res) {
  var user = await models.User.findById(req.params.user_id);
  var userJson = await user.buildResponse();
  return user ? ReS(res, {data: userJson}, 200) : ReE(res, ErrorMessage.UserNotFound, 404);
});

router.put('/:user_id', async function(req, res) {

  var user = await models.User.findById(req.params.user_id);

  try {
    var updatedUser = await user.update(req.body);
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 400)
  }

  var updatedUserJson = await updatedUser.buildResponse();
  
  return ReS(res, {data: updatedUserJson}, 200)

});


router.post('/messages', VerifyToken, async function(req, res) {
  
  var messageRequest = req.body;
  var message = await models.Message.create({
    subject: messageRequest.subject,
    messageBody: messageRequest.messageBody
  });
  // Bug here: SequelizeForeignKeyConstraintError: insert or update on table "MessageRecipients" violates foreign key constraint "MessageRecipients 
  
  try {
    await message.setCreator(req.baseId);
    await message.setRecipient(messageRequest.recipients);
  } catch (e) {
    // TODO log the error here
    return ReE(res, ErrorMessage.UnknownError, 500);
  }

  return ReS(res, {message: "Message sent"}, 201);

});

router.get('/messages/inbox', VerifyToken, async function(req, res) {
  
  try {
    var user = await models.User.findById(req.baseId);
    if (user == null) return ReE(res, {error: "User not found"}, 404)

    var messages = await user.getMessages();
    var messageJson = messages.map(m => m.toJSON());
  } catch (e) {
    return ReR(res, ErrorMessage.UnknownError, 500);
  }
  return ReS(res, {data: messageJson}, 200)
});

router.get('/messages/sent', VerifyToken, async function(req, res) {

  try {
    var sentMessages = await models.Message.findAll({
      where: {
        creatorId: req.baseId
      }
    });
    var messageJson = sentMessages.map(m => m.toJSON());
  } catch (e) {
    return ReR(res, ErrorMessage.UnknownError, 500);
  }

  return ReS(res, {data: messageJson}, 200)
});

router.post('/photos/profile', VerifyToken, avatarUpload.single('avatar'), async function(req, res){
  try {
    
    var user = await models.User.findById(req.baseId)
    var userPhotos = await user.getPhotos()
    avatarPhoto = userPhotos.filter(p => p.isAvatar)[0]
    if (avatarPhoto) {
      await avatarPhoto.destroy()
    }

    var s3path = await uploadProfilePhotoToS3(req.baseId, req.file)

    var photo = await models.Photo.create({path:s3path, UserId: user.id, isAvatar: true})
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
  return ReS(res, {data: s3path}, 200)
});

router.get('/:user_id/photos/profile', async function(req, res) {
  /**
   * User's avatar image is always (GET) /users/<ID>/photos/profile
   * This info isn't stored in any database
   */
  try {
    var user = await models.User.findById(req.params.user_id)
    var userPhotos = await user.getPhotos()
    avatarPhoto = userPhotos.filter(p => p.isAvatar)[0]

    if (!avatarPhoto) {
      // path for default
      return ReS(res, {avatar: 'https://s3.us-east-2.amazonaws.com/casting-complex/user.png'}, 200)
    }

    return ReS(res, {avatar: avatarPhoto.path}, 200)
    
  } catch (e) {
    console.log(e)
  }
})

router.post('/photos', VerifyToken, albumUpload.array('album', 12), async function(req, res){

  try {
    var paths = await uploadPhotosToS3(req.baseId, req.files)
    console.log(paths)

    for (var path of paths) {
      await models.Photo.create({path:path, UserId: req.baseId})
    }
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
  return ReS(res, {paths: paths}, 200)
})

router.get('/:user_id/photos', async function(req, res) {
  /**
   * User's avatar image is always (GET) /users/<ID>/photos/profile
   * This info isn't stored in any database
   */
  try {
    var user = await models.User.findById(req.params.user_id)
    var userPhotos = await user.getPhotos()
    var photos = userPhotos.filter(p => !p.isAvatar)
    return ReS(res, {album: photos}, 200)
  } catch (e) {
    console.log(e)
  }
})

router.delete('/:user_id/photos/:photo_id', VerifyToken, async function(req, res) {
  try {
    var photoToDelete = await models.Photo.findById(req.params.photo_id)

    var objKey = photoToDelete.path.split('/').pop()
    await deleteFromS3(req.baseId, objKey)

    if (photoToDelete.UserId !== req.baseId) {
      return ReE(res, {error: "No auth"}, 500)
    }

    await photoToDelete.destroy()
    
    return ReS(res, {message: "photo deleted"}, 200)
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
})


module.exports = router;
