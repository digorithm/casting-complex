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
  var castingDirectors = await models.CastingDirector.findAll()

  castingDirectorJsonPromises = [];
  for (castingDirector of castingDirectors) {
    castingDirectorJsonPromise = castingDirector.buildResponse();
    castingDirectorJsonPromises.push(castingDirectorJsonPromise);
  }

  Promise.all(castingDirectorJsonPromises).then(castingDirectorsJson => {
    return ReS(res, {data: castingDirectorsJson}, 200);
  });

});

router.get('/:casting_director_id', async function(req, res) {
  var castingDirectorId = req.params.casting_director_id;
  var castingDirector = await models.CastingDirector.findById(castingDirectorId);
  var castingDirectorJson = await castingDirector.buildResponse();

  return ReS(res, {data: castingDirectorJson}, 200)

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
    var castingDirector = await models.CastingDirector.create(req.body)
    await castingDirector.setCastingSpecializations(req.body.specializationId);
    var sessionToken = await castingDirector.createSession();
  } catch (e) {
    return HandleSequelizeError(res, e)
  }

  var castingDirectorJson = await castingDirector.buildResponse();

  return ReS(res, {data: castingDirectorJson, session_token: sessionToken}, 201);
});

router.put('/', VerifyToken, async function(req, res) {

  var castingDirector = await models.CastingDirector.findById(req.userId);
  
  if (req.body.specializationId) {
    var currentSpecializationsId = await castingDirector.getCastingSpecializations().map(s => s.id);
    if (!_.isEqual(req.body.specializationId, currentSpecializationsId)) {
      await castingDirector.setCastingSpecializations(req.body.specializationId);
    }
  }

  try {
    var updatedCastingDirector = await castingDirector.update(req.body);
  } catch (e) {
    return ReE(res, ErrorMessage.UnknownError, 400)
  }

  var updatedCastingDirectorJson = await updatedCastingDirector.buildResponse();
  
  return ReS(res, {data: updatedCastingDirectorJson}, 200)

});

router.delete('/', VerifyToken, async function(req, res) {
   
  try {
    var castingDirector = await models.CastingDirector.findById(req.userId);
    var user = await castingDirector.getUser()

    // TODO: Check if castingDirector is empty of not, so you can throw proper exception

    await castingDirector.destroy();
    await user.destroy();
  } catch(e) {
    return HandleSequelizeError(res, e);
  }
  return ReS(res, {message: "User deleted"}, 204);
  
})

module.exports = router;
