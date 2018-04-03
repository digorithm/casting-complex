var models  = require('../models');
var express = require('express');
var router  = express.Router();
var _ = require('lodash');

var utils  = require('../utils')

var ReE = utils.ReE;
var ReS = utils.ReS;
var ErrorMessage = utils.ErrorMessage;
var HandleSequelizeError = utils.HandleSequelizeError;


router.get('/', async function(req, res) {
  var actors = await models.Actor.findAll()

  actorJsonPromises = [];
  for (actor of actors) {
    actorJsonPromise = actor.buildResponse();
    actorJsonPromises.push(actorJsonPromise);
  }

  Promise.all(actorJsonPromises).then(actorsJson => {
    return ReS(res, {data: actorsJson}, 200);
  });

});

router.get('/:actor_id', async function(req, res) {
  var actorId = req.params.actor_id;
  var actor = await models.Actor.findById(actorId);
  var actorJson = await actor.buildResponse();

  return ReS(res, {data: actorJson}, 200)

});

router.post('/', async function(req, res) {

  try {
    var user = await models.User.create(req.body.user)
  } catch (e) {
    return HandleSequelizeError(res, e)
  }
  
  // Add user id to request object
  req.body.userId = user.id

  try {
    var actor = await models.Actor.create(req.body)
    await actor.setCredits(req.body.creditId);
    await actor.setUnions(req.body.unionId);
  } catch (e) {
    return HandleSequelizeError(res, e)
  }

  var actorJson = await actor.buildResponse();

  return ReS(res, {data: actorJson}, 201);
});

router.put('/:actor_id', async function(req, res) {

  var actor = await models.Actor.findById(req.params.actor_id);

  if (req.body.creditId) {
    var currentCreditsId = await actor.getCredits().map(c => c.id);
    if (!_.isEqual(req.body.creditsId, currentCreditsId)) {
      await actor.setCredits(req.body.creditId);
    }
  }

  if (req.body.unionId) {
    var currentUnionsId = await actor.getUnions().map(u => u.id);
    if (!_.isEqual(req.body.unionId,currentUnionsId)) {
      await actor.setUnions(req.body.unionId);
    }
  }

  try {
    var updatedActor = await actor.update(req.body);
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 400)
  }

  var updatedActorJson = await updatedActor.buildResponse();
  
  return ReS(res, {data: updatedActorJson}, 200)

});

router.delete('/:actor_id', async function(req, res) {
   
  try {
    var actor = await models.Actor.findById(req.params.actor_id);
    var user = await actor.getUser()

    // TODO: Check if actor is empty of not, so you can throw proper exception

    await actor.destroy();
    await user.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "User deleted"}, 204);
  
})

module.exports = router;
