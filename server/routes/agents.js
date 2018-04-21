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
  var agents = await models.Agent.findAll()

  agentJsonPromises = [];
  for (agent of agents) {
    agentJsonPromise = agent.buildResponse();
    agentJsonPromises.push(agentJsonPromise);
  }

  Promise.all(agentJsonPromises).then(agentsJson => {
    return ReS(res, {data: agentsJson}, 200);
  });

});

router.get('/:agent_id', async function(req, res) {
  var agentId = req.params.agent_id;
  var agent = await models.Agent.findById(agentId);
  var agentJson = await agent.buildResponse();

  return ReS(res, {data: agentJson}, 200)

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
    var agent = await models.Agent.create(req.body)
    await agent.setAgencyDivisions(req.body.agencyDivisionId);
    await agent.setRosterTypes(req.body.rosterTypeId);
    var sessionToken = await agent.createSession();
  } catch (e) {
    return HandleSequelizeError(res, e)
  }

  var agentJson = await agent.buildResponse();

  return ReS(res, {data: agentJson, session_token: sessionToken}, 201);
});

router.put('/', VerifyToken, async function(req, res) {

  var agent = await models.Agent.findById(req.userId);
  
  if (req.body.rosterTypeId) {
    var currentRosterTypesId = await agent.getRosterTypes().map(r => r.id);
    if (!_.isEqual(req.body.rosterTypeId, currentRosterTypesId)) {
      await agent.setRosterTypes(req.body.rosterTypeId);
    }
  }

  if (req.body.agencyDivisionId) {
    var currentAgencyDivisionsId = await agent.getAgencyDivisions().map(d => d.id);
    if (!_.isEqual(req.body.agencyDivisionId,currentAgencyDivisionsId)) {
      await agent.setAgencyDivisions(req.body.agencyDivisionId);
    }
  }
  
  try {
    var updatedAgent = await agent.update(req.body);
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 400)
  }

  var updatedAgentJson = await updatedAgent.buildResponse();
  
  return ReS(res, {data: updatedAgentJson}, 200)

});

router.delete('/', VerifyToken, async function(req, res) {
   
  try {
    var agent = await models.Agent.findById(req.userId);
    var user = await agent.getUser()

    // TODO: Check if agent is empty of not, so you can throw proper exception

    await agent.destroy();
    await user.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "User deleted"}, 204);
  
})

router.post('/actors', VerifyToken, async function(req, res) {
  
  actorIdToBeAdded = req.body.actorId;

  var agent = await models.Agent.findById(req.userId);
  if (agent == null) return ReE(res, {error: "Agent not found"}, 404)

  try {
    await agent.addActor(actorIdToBeAdded);
    await models.Actor.update(
      { isRepresented: true },
      { where: { id: actorIdToBeAdded }}
    );
    return ReS(res, {message: "Actor added to agent"}, 200);
  } catch(e) {
    return ReE(res, {error: e}, 500);
  }
});

router.delete('/actors', VerifyToken, async function(req, res) {
  
  actorIdToBeRemoved = req.body.actorId;

  var agent = await models.Agent.findById(req.userId);
  if (agent == null) return ReE(res, {error: "Agent not found"}, 404)

  try {
    await agent.removeActor(actorIdToBeRemoved);
    
    var actor = await models.Actor.findById(actorIdToBeRemoved);

    var actorAgents = await actor.getAgents();

    if (actorAgents.length == 0) {
      await models.Actor.update(
        { isRepresented: false },
        { where: { id: actorIdToBeRemoved }}
      );
    }
    
    return ReS(res, {message: "Actor removed from agent"}, 200);
  } catch(e) {
    return ReE(res, {error: e}, 500);
  }

});

router.get('/:agent_id/actors', async function(req, res) {

  var agent = await models.Agent.findById(req.params.agent_id);

  try {

    agentActors = await agent.getActors();
    agentActorsJsonPromises = [];
    for (actor of agentActors) {
      agentActorsJsonPromise = actor.buildResponse();
      agentActorsJsonPromises.push(agentActorsJsonPromise);
    }

    Promise.all(agentActorsJsonPromises).then(agentActorsJson => {
      return ReS(res, {data: agentActorsJson}, 200);
    });
    
  } catch(e) {
    return ReE(res, {error: e}, 500);
  }
});

module.exports = router;
