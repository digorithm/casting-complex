var models  = require('../models');
var express = require('express');
var router  = express.Router();

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

/*
router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

*/
module.exports = router;
