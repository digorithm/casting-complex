var models  = require('../models');
var express = require('express');
var router  = express.Router();
var _ = require('lodash');

var VerifyToken = require('./verify_token');

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
  console.log("I should NOT be here")
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
    var sessionToken = await actor.createSession();
  } catch (e) {
    console.log(e)
    return HandleSequelizeError(res, e)
  }

  var actorJson = await actor.buildResponse();

  return ReS(res, {data: actorJson, session_token: sessionToken}, 201);
});

router.put('/', VerifyToken, async function(req, res, next) {

  var actor = await models.Actor.findById(req.userId);

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

router.delete('/', VerifyToken, async function(req, res) {
   
  try {
    var actor = await models.Actor.findById(req.userId);
    var user = await actor.getUser()

    // TODO: Check if actor is empty of not, so you can throw proper exception

    await actor.destroy();
    await user.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "User deleted"}, 204);
  
})

router.get('/:actor_id/agents', async function(req, res) {

  // TODO: decide who can see agents of an actor.

  var actor = await models.Actor.findById(req.params.actor_id);
  
  if (actor.isRepresented === false) {
    console.log("here");
    return ReS(res, {data: []}, 200);
  }
  
  actorAgents = await actor.getAgents();

  actorAgentsJsonPromises = [];
  for (agent of actorAgents) {
    actorAgentJsonPromise = agent.buildResponse();
    actorAgentsJsonPromises.push(actorAgentJsonPromise);
  }

  Promise.all(actorAgentsJsonPromises).then(actorAgentsJson => {
    return ReS(res, {data: actorAgentsJson}, 200);
  });
});

router.delete('/agents', VerifyToken, async function(req, res) {

  var actor = await models.Actor.findById(req.userId);
  if (actor == null) return ReE(res, {error: "Actor not found"}, 404)

  agentIdToBeRemoved = req.body.agentId;

  try {
    await actor.removeAgent(agentIdToBeRemoved);

    var actorAgents = await actor.getAgents();

    if (actorAgents.length == 0) {
      await models.Actor.update(
        { isRepresented: false },
        { where: { id: actor.id }}
      );
    }
    
    return ReS(res, {message: "Agent removed from actor"}, 200);
  } catch(e) {
    return ReE(res, {error: e}, 500);
  }

});

router.get('/:actor_id/auditions', VerifyToken, async function(req, res) {

  if (req.params.actor_id != req.userId) {
    return ReE(res, {error: "Bad request"}, 404) 
  }
  
  var actor = await models.Actor.findById(req.userId);
  if (actor == null) return ReE(res, {error: "Actor not found"}, 404)

  try {
    var auditions = await models.Audition.findAll(
      {
        where: {ActorId: actor.id}
      }
    );
    var auditionsJson = auditions.map(a => a.toJSON());
    
    return ReS(res, auditionsJson, 200)
  } catch (e) {
    return ReE(res, {error: e}, 500)
  }
});

module.exports = router;
