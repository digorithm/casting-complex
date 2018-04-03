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
  } catch (e) {
    return HandleSequelizeError(res, e)
  }

  var agentJson = await agent.buildResponse();

  return ReS(res, {data: agentJson}, 201);
});

router.put('/:agent_id', async function(req, res) {

  var agent = await models.Agent.findById(req.params.agent_id);
  
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

router.delete('/:agent_id', async function(req, res) {
   
  try {
    var agent = await models.Agent.findById(req.params.agent_id);
    var user = await agent.getUser()

    // TODO: Check if agent is empty of not, so you can throw proper exception

    await agent.destroy();
    await user.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "User deleted"}, 204);
  
})

module.exports = router;
