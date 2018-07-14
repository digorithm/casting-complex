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


router.post('/approve/agent/:agent_id', VerifyToken, async function(req, res) {

  try {
    var agent = await models.Agent.findById(req.params.agent_id)
    if (agent == null) return ReE(res, {error: "Agent not found"}, 404)
    
    await agent.update({accountApproved: true})

  } catch (e) {
    return ReE(res, e, 500)    
  }

  return ReS(res, "all good", 200)
})

router.post('/approve/director/:director_id', VerifyToken, async function(req, res) {

  try {
    var director = await models.CastingDirector.findById(req.params.director_id)
    if (director == null) return ReE(res, {error: "Director not found"}, 404)
    
    await director.update({accountApproved: true})
    
  } catch (e) {
    return ReE(res, e, 500)
  }

  return ReS(res, "all good", 200)
})

router.post('/news', VerifyToken, async function(req, res) {
  
  try {
    var news = req.body
    var newsInstance = await models.News.create(news)
  } catch (e) {
    console.log(e)
    return ReE(res, e, 500)
  }
  
  return ReS(res, newsInstance.toJSON(), 200)
})

router.put('/news/:news_id', VerifyToken, async function(req, res) {
  
  try {
    var updatedNews = req.body
    var newsInstance = await models.News.findById(req.params.news_id)
    var updatedNewsInstance = await newsInstance.update(updatedNews)
  } catch (e) {
    console.log(e)
    return ReE(res, e, 500)
  }
  
  return ReS(res, updatedNewsInstance.toJSON(), 200)
})

router.get('/news', async function(req, res) {
  
  try {
    var news = await models.News.findAll()

    var newsJson = news.map(n => n.toJSON())
  } catch (e) {
    console.log(e)
    return ReE(res, e, 500)
  }
  
  return ReS(res, newsJson, 200)
})

router.delete('/news/:news_id', VerifyToken, async function(req, res) {
  
  try {
    var news = await models.News.findById(req.params.news_id)

    await news.destroy()
  } catch (e) {
    console.log(e)
    return ReE(res, e, 500)
  }
  
  return ReS(res, "all good", 200)
})

module.exports = router;