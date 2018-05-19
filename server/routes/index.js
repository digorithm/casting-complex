var models  = require('../models');
var express = require('express');
var router  = express.Router();

var bcrypt = require('bcryptjs');
var _ = require('lodash');

var utils  = require('../utils')

var ReE = utils.ReE;
var ReS = utils.ReS;
var ErrorMessage = utils.ErrorMessage;
var HandleSequelizeError = utils.HandleSequelizeError;

router.get('/', function(req, res) {
    res.render('index', {
      title: 'hello world',
      message: 'this is coming from here'
    });
});

router.post('/login', async function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  var user = await models.User.findOne({
    where: { $or: [{username: username}, {email: username}] }
  });
  
  if (user === null) {
    return ReE(res, {error: "User or password incorrect"}, 404);
  }
  var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  
  if (!passwordIsValid){
    return ReE(res, {auth: false, session_token: null}, 401);
  }

  var roleId = user.roleId;

  if (roleId == 1) {
    var userRole = await models.Actor.findOne( { where: { userId: user.id } } )
  } else if (roleId == 2) {
    var userRole = await models.CastingDirector.findOne( { where: { userId: user.id } } )
  } else {
    var userRole = await models.Agent.findOne( { where: { userId: user.id } } )
  }

  var sessionToken = await userRole.createSession();

  var profile = await userRole.buildResponse()
  
  return ReS(res, {auth: true, session_token: sessionToken, profile: profile}, 200);

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
