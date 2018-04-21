var models  = require('../models');
var express = require('express');
var router  = express.Router();

var VerifyToken = require('./verify_token');

var utils  = require('../utils')

var ReE = utils.ReE;
var ReS = utils.ReS;
var ErrorMessage = utils.ErrorMessage; 


router.get('/', async function(req, res) {
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

module.exports = router;
