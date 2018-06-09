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
  
  //Query all actors
  if (username === undefined) {
    var actors = await models.Actor.findAll()

    actorJsonPromises = [];
    for (actor of actors) {
      actorJsonPromise = actor.buildResponse();
      actorJsonPromises.push(actorJsonPromise);
    }

    Promise.all(actorJsonPromises).then(actorsJson => {
      return ReS(res, {data: actorsJson}, 200);
    });
  } else {
    // Query by username
    var user = await models.User.findOne({
      where: { username: username }
    })

    var actor = await models.Actor.findOne({where: { userId: user.id }})

    var actorJson = await actor.buildResponse();

    return ReS(res, {data: actorJson}, 200)
  }
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

  // Meaning that it wants to update user's email
  if (req.body.user) {
    try {
      var user = await models.User.findById(req.baseId)
      await user.update(req.body.user)
    } catch (e) {
      console.log(e)
      return ReE(res, e, 500)
    }
  }

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

  if (req.body.languageId) {
    var currentLanguagesId = await actor.getLanguages().map(l => l.id);
    if (!_.isEqual(req.body.languageId,currentLanguagesId)) {
      await actor.setLanguages(req.body.languageId);
    }
  }

  try {
    var updatedActor = await actor.update(req.body);
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 500)
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

router.post('/experiences', VerifyToken, async function(req, res) { 

  try {
    var actor = await models.Actor.findById(req.userId);

    var experienceToAdd = req.body

    var experienceInstance = await models.Experience.create(experienceToAdd)

    var actorExperiences = await actor.getExperiences()
    var experiences = []
    // Get experience type's name, which is the same as Agency Division names
    for (var experience of actorExperiences) {
      var experienceJson = await experience.toJSON()
      var modelInstance = await models.AgencyDivision.findById(experience.typeId)
      experienceJson.type = modelInstance.name
      experiences.push(experienceJson)
    }
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 500)
  }

  return ReS(res, experiences, 201);
})


router.post('/skills', VerifyToken, async function(req, res) { 

  var actor = await models.Actor.findById(req.userId);
  
  var actorSkills = await actor.getSkills()

  // req.body will be an array of skills, the name, not the id
  var skillsToUpdate = req.body

  var skillInstances = await models.Skill.findAll(
    { where: 
      { 
        name: { $or: skillsToUpdate }
      }
    })
  var skillIdToBeAdded = skillInstances.map(s => s.id)
  await actor.addSkill(skillIdToBeAdded)  
  
  // Add to skill database the skills that don't exist yet
  var existingSkillNames = skillInstances.map(s => s.name)

  var differences = _.differenceWith(skillsToUpdate, existingSkillNames)

  for (difference of differences) {
    var lowerCaseDiff = difference.toLowerCase().trim().replace(/\s\s+/g, ' ');
    var capitalizedDiff = lowerCaseDiff.replace(/^\w/, c => c.toUpperCase())
    
    var skillObj = { name: capitalizedDiff }
    
    var newSkill = await models.Skill.create(skillObj)

    await actor.addSkill(newSkill.id)
  }

  var updatedSkillsInstance = await actor.getSkills()

  var updatedSkills = updatedSkillsInstance.map(function(s) { return { name: s.name, id: s.id }})

  return ReS(res, updatedSkills, 200);
  
})

router.delete('/skills', VerifyToken, async function(req, res) { 

  var actor = await models.Actor.findById(req.userId);
  // req.body will be an array of skills, the name, not the id
  var skillToDelete = req.query.skill

  var skillInstance = await models.Skill.findOne(
    { where: 
      { 
        name: skillToDelete
      }
    })
  
  await actor.removeSkill(skillInstance.id)

  var updatedSkillsInstance = await actor.getSkills()

  var updatedSkills = updatedSkillsInstance.map(function(s) { return { name: s.name, id: s.id }})

  return ReS(res, updatedSkills, 200);
  
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

router.get('/:actor_id/auditions/requests', VerifyToken, async function(req, res) {

  if (req.params.actor_id != req.userId) {
    return ReE(res, {error: "Bad request"}, 404) 
  }
  
  var actor = await models.Actor.findById(req.userId);
  if (actor == null) return ReE(res, {error: "Actor not found"}, 404)

  try {
    var requests = await models.AuditionRequest.findAll(
      {
        where: {ActorId: actor.id}
      }
    );
    var requestsJson = requests.map(r => r.toJSON());
    
    return ReS(res, requestsJson, 200)
  } catch (e) {
    return ReE(res, {error: e}, 500)
  }
});

module.exports = router;
