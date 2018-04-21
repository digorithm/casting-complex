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

  try {
    var breakdowns = await models.Breakdown.findAll();
  
    var breakdownJsons = breakdowns.map(b => b.toJSON())
  } catch (e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: breakdownJsons}, 200)

});

router.get('/:breakdown_id', async function(req, res) {
  
  try {

    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);

  } catch (e) {
    return ReE(res, {error: e}, 500)
  }  

  return ReS(res, {data: breakdown.toJSON()}, 200)

});

router.post('/', VerifyToken, async function(req, res) {
  var breakdownRequest = req.body

  var directorFromUser = await models.CastingDirector.findOne({
    where: {userId: req.baseId}
  });

  if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

  if (breakdownRequest.castingDirectorId != directorFromUser.id) return ReE(res, {error: "Bad request"}, 400)

  var breakdown = await models.Breakdown.create(breakdownRequest);

  await castingDirector.setBreakdown([breakdown]);
  await breakdown.setMediaType(breakdownRequest.mediaTypeId);

  var createdBreakdown = await models.Breakdown.findById(breakdown.id);

  return ReS(res, {data: createdBreakdown.toJSON()}, 201)

});

router.put('/:breakdown_id', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 500)
  }

  if (breakdown == null) return ReE(res, {error: "No breakdown found"}, 404);

  var directorFromUser = await models.CastingDirector.findOne({
    where: {userId: req.baseId}
  });

  if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

  if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  try {
    var updatedBreakdown = await breakdown.update(req.body);
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: updatedBreakdown.toJSON()}, 200)
});

router.delete('/:breakdown_id', VerifyToken, async function(req, res) {

  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);

    if (breakdown == null) return ReE(res, {error: "No breakdown found"}, 404);

    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

    await breakdown.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "Breakdown deleted"}, 204);
  
});

/*

 Routes for Breakdown roles

*/

router.post('/:breakdown_id/roles', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
    
    if (breakdown == null) return ReE(res, {error: "No breakdown found"}, 404);

    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    var role = await models.BreakdownRole.create({description: req.body.description, ageRange: req.body.ageRange, BreakdownId: breakdown.id})

    var createdRole = await breakdown.addRole(role)
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: role}, 201)
});

router.get('/:breakdown_id/roles', async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {

    var roles = await breakdown.getRole();
    var rolesJson = roles.map(r => r.toJSON());
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: rolesJson}, 200)
});

router.get('/:breakdown_id/roles/:role_id', async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    // TODO: check if role.BreakdownId == breakdown.id
    var role = await models.BreakdownRole.findById(req.params.role_id);
    var roleJson = role.toJSON();
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: roleJson}, 200)
});

router.put('/:breakdown_id/roles/:role_id', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);

    if (breakdown == null) return ReE(res, {error: "No breakdown found"}, 404);

    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    // TODO: check if role.BreakdownId == breakdown.id

    var role = await models.BreakdownRole.findById(req.params.role_id);
    var updatedRole = await role.update(req.body);
    var rolesJson = updatedRole.toJSON();

  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: rolesJson}, 200)
});

router.delete('/:breakdown_id/roles/:role_id', VerifyToken, async function(req, res) {

  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
    
    if (breakdown == null) return ReE(res, {error: "No breakdown found"}, 404);

    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch(e) {
    return HandleSequelizeError(res, e);
  }

  try {

    var role = await models.BreakdownRole.findById(req.params.role_id);
    
    if (role === null) {
      return ReE(res, {message: "Role not found"}, 404);
    }
    
    await role.destroy();

  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  
  return ReS(res, {message: "Role deleted"}, 200);
  
});

/*

 Routes for Breakdown audition requests

*/

router.post('/:breakdown_id/roles/:role_id/requests', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  var actorFromUser = await models.Actor.findOne({
    where: {userId: req.baseId}
  });

  if (actorFromUser == null) return ReE(res, {error: "No actor found"}, 404);

  if (req.body.ActorId != actorFromUser.id) return ReE(res, {error: "Bad request"}, 400)

  try {
    
    var breakdownAuditionRequest = await breakdown.createAuditionRequest({
      ActorId: actorFromUser.id,
      comments: req.body.comments,
      statusId: 1,
      BreakdownId: breakdown.id,
      roleId: req.params.role_id,
      isScheduled: false
    });

    await breakdown.addAuditionRequest(breakdownAuditionRequest);
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {message: "Request sent"}, 201)
});

router.get('/:breakdown_id/roles/:role_id/requests', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
    
    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    // TODO: check if role.BreakdownId == breakdown.id
    var auditionRequests = await breakdown.getAuditionRequests();
    var auditionRequestsJson = auditionRequests.map(a => a.toJSON());
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: auditionRequestsJson}, 200)
});

router.post('/:breakdown_id/roles/:role_id/requests/:req_id/answer', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
    
    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    var auditionRequest = await models.AuditionRequest.findById(req.params.req_id)

    if (auditionRequest.BreakdownId !== breakdown.id) {
      return ReE(res, {message: "Wrong audition request"}, 400)
    }

    var answer = req.body.accepts

    if (answer === true) {
      await auditionRequest.update({statusId: 2});

      var message = await models.Message.create({
        subject: "Audition request accepted",
        messageBody: "Your audition request for the project " + breakdown.name + " has been accepted."
      });
      
      await message.setCreator(breakdown.CastingDirectorId);
      await message.setRecipient(auditionRequest.ActorId);

      return ReS(res, {message: "Request approved"}, 200)
    } else if (answer === false) {
      await auditionRequest.update({statusId: 3});

      var message = await models.Message.create({
        subject: "Audition request rejected",
        messageBody: "Your audition request for the project " + breakdown.name + " has been rejected."
      });
      
      await message.setCreator(breakdown.CastingDirectorId);
      await message.setRecipient(auditionRequest.ActorId);

      return ReS(res, {message: "Request rejected"}, 200)
    } else {
      return ReE(res, {error: "Bad request. Missing answer field."}, 400)
    }

  } catch(e) {
    return ReE(res, {error: e}, 400)
  }

});

/*

 Routes for Breakdown auditions

*/

router.post('/:breakdown_id/auditions', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);

    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {

    var auditionRequest = await models.AuditionRequest.findById(req.body.auditionRequestId)
    
    var breakdownAudition = await models.Audition.create({
      address: req.body.address,
      comments: req.body.comments,
      startsWhen: req.body.startsWhen,
      endsWhen: req.body.endsWhen,
      breakdownId: breakdown.id,
      statusId: 1,
      ActorId: auditionRequest.ActorId
    });

    var message = await models.Message.create({
      subject: "Audition scheduled",
      messageBody: "Your audition for the project " + breakdown.name + " has been scheduled for " + breakdownAudition.startsWhen + " to " + breakdownAudition.endsWhen + " at " + breakdownAudition.address
    });
    
    await message.setCreator(breakdown.CastingDirectorId);
    await message.setRecipient(auditionRequest.ActorId);

    await auditionRequest.update({isScheduled: true});
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: breakdownAudition.toJSON()}, 201)
});

router.get('/:breakdown_id/auditions', async function(req, res) {
  
  // TODO: decide who can access this
  
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    var auditions = await models.Audition.findAll(
      {
        where: {breakdownId: breakdown.id}
      }
    );
    var auditionsJson = auditions.map(a => a.toJSON());
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: auditionsJson}, 200)
});

router.get('/:breakdown_id/auditions/:audition_id', async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    var audition = await models.Audition.findOne(
      {
        where: {
          breakdownId: breakdown.id,
          id: req.params.audition_id
        }
      }
    );
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: audition.toJSON()}, 200)
});

router.put('/:breakdown_id/auditions/:audition_id', VerifyToken, async function(req, res) {
 
  try {
    var breakdown = await models.Breakdown.findById(req.params.breakdown_id);
    
    var directorFromUser = await models.CastingDirector.findOne({
      where: {userId: req.baseId}
    });

    if (directorFromUser == null) return ReE(res, {error: "No director found"}, 404);

    if (breakdown.CastingDirectorId != directorFromUser.id) return ReE(res, {error: "You don't own this breakdown"}, 403)

  } catch (e) {
    return ReE(res, {error: e}, 400)
  }

  try {
    var audition = await models.Audition.findOne(
      {
        where: {
          breakdownId: breakdown.id,
          id: req.params.audition_id
        }
      }
    );

    await audition.update(req.body);
    
  } catch(e) {
    return ReE(res, {error: e}, 500)
  }

  return ReS(res, {data: audition.toJSON()}, 200)
});

module.exports = router;
