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
  var extras = {};

  var model = ["Ethnicity", "Credit", "Hair", "Role", "RosterType", "Union", "Gender", "Eye", "CastingSpecialization", "BreakdownStatus", "AuditionStatus", "AuditionRequestStatus", "AgencyDivision", "Language", "Skill"];

  for (m of model) {
    extras[m] = await models[m].findAll({attributes: ['id', 'name']})
                               .map(m => m.toJSON());
  }

  return ReS(res, {data: extras}, 200)

});

router.get('/cities/:country_id', async function(req, res) {

  var cities = await models.City.findAll({
    attributes: ['id', 'name'],
    where: { countryId: req.params.country_id }
  }).map(c => c.toJSON());
  
  return ReS(res, {data: cities}, 200)

});

router.get('/countries/', async function(req, res) {

  var countries = await models.Country.findAll({
    attributes: ['id', 'name']
  }).map(c => c.toJSON());
  
  return ReS(res, {data: countries}, 200)

});

module.exports = router;