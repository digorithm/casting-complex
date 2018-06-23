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
    if (!fs.existsSync('storage/')) {
      fs.mkdirSync('storage/')
    }

    if (!fs.existsSync('storage/' + req.baseId)) {
      fs.mkdirSync('storage/' + req.baseId)
    }

    // Check if there's an avatar already uploaded
    var rootFolder = path.resolve(__dirname, '../')
    var avatarPath = 'storage/' + req.baseId
    var avatarFolder = rootFolder + '/'+  avatarPath

    var dir = fs.readdirSync(avatarFolder)

    // Move uploaded file to this user's avatar folder
    var re = /(?:\.([^.]+))?$/;
    var fileExtension = re.exec(req.file.originalname)

    var uploadedPath = 'uploads/' + req.file.originalname
    var destinationPath = 'storage/' + req.baseId + '/avatar' + fileExtension[0]
    
    fs.copyFileSync(uploadedPath, destinationPath)
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
  return ReS(res, {}, 200)
});

router.get('/:user_id/photos/profile', async function(req, res) {
  /**
   * User's avatar image is always (GET) /users/<ID>/photos/profile
   * This info isn't stored in any database
   */
  try {
    var rootFolder = path.resolve(__dirname, '../')
    var avatarPath = 'storage/' + req.params.user_id

    defaultImage = rootFolder + '/' + 'user.png'
    var defaultImageFile = fs.readFileSync(defaultImage)

    if (!fs.existsSync(avatarPath)) {
      // no avatar set
      // send generic image
      return ReS(res, {avatar: defaultImageFile.toString('base64')}, 200)
    }
    
    var avatarFolder = rootFolder + '/'+  avatarPath

    var dir = fs.readdirSync(avatarFolder)

    // Find the file called avatar or return default image if it isn't found
    for (file of dir) {
      if (file.split('.')[0] === 'avatar') {
        var filePath = avatarFolder + '/' + file
        var file = fs.readFileSync(filePath)
        return ReS(res, {avatar: file.toString('base64')}, 200)
      }
    }
    return ReS(res, {avatar: defaultImageFile.toString('base64')}, 200)
    
  } catch (e) {
    console.log(e)
  }
})

router.post('/photos', VerifyToken, albumUpload.array('album', 12), async function(req, res){

  try {
    if (!fs.existsSync('storage/')) {
      fs.mkdirSync('storage/')
    }

    if (!fs.existsSync('storage/' + req.baseId)) {
      fs.mkdirSync('storage/' + req.baseId)
    }

    if (!fs.existsSync('storage/' + req.baseId + '/album')) {
      fs.mkdirSync('storage/' + req.baseId + '/album')
    }
    
    // Check if there's an avatar already uploaded
    var rootFolder = path.resolve(__dirname, '../')
    var albumPath = rootFolder + '/storage/' + req.baseId + '/album'

    for (file of req.files) {
      var uploadedPath = 'uploads/' + file.originalname
      var destinationPath = 'storage/' + req.baseId + '/album/' + file.originalname
    
      fs.copyFileSync(uploadedPath, destinationPath)
    }
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
  return ReS(res, {}, 200)
})

router.get('/:user_id/photos', async function(req, res) {
  /**
   * User's avatar image is always (GET) /users/<ID>/photos/profile
   * This info isn't stored in any database
   */
  try {
    var rootFolder = path.resolve(__dirname, '../')
    var albumPath = rootFolder + '/storage/' + req.params.user_id + '/album'

    if (!fs.existsSync(albumPath)) {
      // no avatar set
      // send generic image
      return ReS(res, {album: []}, 200)
    }

    var dir = fs.readdirSync(albumPath)

    var photos = []
    // Find the file called avatar or return default image if it isn't found
    for (file of dir) {
      var filePath = albumPath + '/' + file
      var fileBase64 = fs.readFileSync(filePath).toString('base64')
      photos.push({photo: fileBase64, name: file})
    }
    return ReS(res, {album: photos}, 200)
    
  } catch (e) {
    console.log(e)
  }
})

router.delete('/:user_id/photos', VerifyToken, async function(req, res) {
  try {
    var rootFolder = path.resolve(__dirname, '../')
    var albumPath = rootFolder + '/storage/' + req.baseId + '/album'
    var photoToDelete = albumPath + '/' + req.body.photo_name

    if (!fs.existsSync(photoToDelete)) {
      // no avatar set
      // send generic image
      return ReS(res, {message: "No photo found"}, 404)
    }

    fs.unlinkSync(photoToDelete)
    
    return ReS(res, {message: "photo deleted"}, 200)
    
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
})


module.exports = router;
