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

  var username = req.query.username;
  
  //Query all agents
  if (username === undefined) {

    var agents = await models.Agent.findAll()

    agentJsonPromises = [];
    for (agent of agents) {
      agentJsonPromise = agent.buildResponse();
      agentJsonPromises.push(agentJsonPromise);
    }

    Promise.all(agentJsonPromises).then(agentsJson => {
      return ReS(res, {data: agentsJson}, 200);
    });
  } else {
    // Query by username
    var user = await models.User.findOne({
      where: { username: username }
    })

    var agent = await models.Agent.findOne({where: { userId: user.id }})

    var agentJson = await agent.buildResponse();

    return ReS(res, {data: agentJson}, 200)
  }
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

router.post('/references', VerifyToken, async function(req, res) {
   
  try {
    var agent = await models.Agent.findById(req.userId);
    var user = await agent.getUser();

    var references = req.body.references;
    var referenceModels = []

    for (reference of references) {
      var refObj = await models.Reference.create(reference)
      referenceModels.push(refObj)
    }
    
    await user.setReferences(referenceModels);

  } catch(e) {
    console.log(e)
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "References added"}, 201);

})

router.get('/:agent_id/references', async function(req, res) {
   
  try {
    var agent = await models.Agent.findById(req.params.agent_id);
    var user = await agent.getUser();
    var references = await user.getReferences();

  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {data: references}, 200);
  
})

router.post('/:agent_id/requests', VerifyToken, async function(req, res) {

  // Actor id is in the req header because who calls this is the actor
  var actor = await models.Actor.findById(req.userId);
  if (actor == null) return ReE(res, {error: "Actor not found"}, 404)

  var agent = await models.Agent.findById(req.params.agent_id);
  if (agent == null) return ReE(res, {error: "Agent not found"}, 404)

  var reqs = await agent.getRepRequests()
  // check if req exists
  for (var req of reqs) {
    if (req.ActorId === actor.id && req.statusId === 1) {
      return ReE(res, "Double request", 400)
    }
  }
  try {
    var request = { statusId: 1, ActorId: actor.id, AgentId: agent.id }

    var createdRequest = await models.RepRequest.create(request)

    return ReS(res, "Request sent", 200)

  } catch (e) {
    return ReE(res, {error: e}, 500)
  }
})

router.get('/:agent_id/requests', VerifyToken, async function(req, res) {
  
  if (req.params.agent_id != req.userId) {
    return ReE(res, {error: "Bad request"}, 404) 
  }

  try {
    var agent = await models.Agent.findById(req.userId);
    if (agent == null) return ReE(res, {error: "Agent not found"}, 404)

    var reqs = await agent.getRepRequests()

    // Get only pending requests
    var filteredReqs = reqs.filter(r => r.statusId === 1)
    
    if (filteredReqs.length > 0) {
      var reqsJson = filteredReqs.map(r => r.toJSON())

      for (var [idx, req] of filteredReqs.entries()) {
        var actor = await models.Actor.findById(req.ActorId)
        var actorResponse = await actor.buildResponse()
        var actorInfo = {}
        actorInfo.actorName = actorResponse.firstName + ' ' + actorResponse.lastName
        actorInfo.username = actorResponse.user.username
        actorInfo.avatar = actorResponse.user.avatar
        reqsJson[idx].actor = actorInfo
      }

      return ReS(res, reqsJson, 200)
    }
    return ReS(res, [], 200)
  } catch (e) {
    return ReE(res, {error: e}, 500)
  }
})

router.post('/:agent_id/requests/:req_id/reply', VerifyToken, async function(req, res) {

  var repRequest = await models.RepRequest.findById(req.params.req_id)
  if (req === null) return ReE(res, {error: "Request not found"}, 404)

  var actor = await models.Actor.findById(repRequest.ActorId)

  if (actor.isRepresented) {
    await repRequest.destroy()
    return ReE(res, {error: "Actor is repped"}, 400)
  }

  var agent = await models.Agent.findById(req.userId);
  if (agent == null) return ReE(res, {error: "Agent not found"}, 404)
  
  // Agents are calling this
  if (repRequest.AgentId !== req.userId) {
    return ReE(res, {error: "Bad request"}, 400)
  }

  // TODO: check if actor is already repped, if so, return error message and delete request
  
  try {
    var accepts = req.body.accepts

    console.log(accepts)
    if (accepts) {
      await agent.addActor(repRequest.ActorId);
      await models.Actor.update(
        { isRepresented: true },
        { where: { id: repRequest.ActorId }}
      );
      await repRequest.update({statusId: 2})
    } else {
      await repRequest.update({statusId: 3})
    }
    
    return ReS(res, "All good", 200)

  } catch (e) {
    return ReE(res, {error: e}, 500)
  }
})

router.get('/:agent_id/auditions', VerifyToken, async function(req, res) {
  
  if (req.params.agent_id != req.userId) {
    return ReE(res, {error: "Bad request"}, 404) 
  }
  
  var agent = await models.Agent.findById(req.userId);
  if (agent == null) return ReE(res, {error: "Agent not found"}, 404)
  
  var allAuditions = []

  try {
    agentActors = await agent.getActors();
    for (actor of agentActors) {
      var auditions = await models.Audition.findAll(
        {
          where: {ActorId: actor.id}
        }
      );
      
      if (auditions.length > 0) {
        var auditionsJson = auditions.map(a => a.toJSON())
        
        for (var [idx, audition] of auditions.entries()) {

          var actor = await models.Actor.findById(audition.ActorId)
          var actorName = actor.firstName + ' ' + actor.lastName
          var breakdown = await audition.getBreakdown()
    
          auditionsJson[idx].actorName = actorName
          auditionsJson[idx].project = breakdown.name
        }

        allAuditions.push(auditionsJson)
      }
    }
    // flatten it
    allAuditions = allAuditions.reduce((acc, val) => acc.concat(val), [])

    return ReS(res, allAuditions, 200)
  } catch (e) {
    console.log(e)
    return ReE(res, {error: e}, 500)
  }
});

module.exports = router;
