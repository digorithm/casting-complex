'use strict';

var moment = require('moment');
var utils  = require('../utils')
var jwt = require('jsonwebtoken');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];

var RemoveFields = utils.RemoveFields;


module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define('Agent', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    phone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    position: DataTypes.STRING,
    agencyName: DataTypes.STRING,
    zipPostal: DataTypes.STRING,
    website: DataTypes.STRING,
    sizeOfRoster: DataTypes.INTEGER,
    profile: DataTypes.TEXT,
    accountApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    associations: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Agent.belongsTo(models.User, {
          as: "user"
        });

        Agent.belongsToMany(models.Actor, {
          through: "Agent_Actor",
          foreignKey: "agentId",
          timestamps: false
        })
        
        Agent.belongsTo(models.Country, {
          as: "country"
        });
        
        Agent.belongsTo(models.City, {
          as: "city"
        });
        
        Agent.belongsToMany(models.RosterType, {
          through: "Agent_RosterType",
          foreignKey: "agentId",
          timestamps: false
        });
        
        Agent.belongsToMany(models.AgencyDivision, {
          through: "Agent_AgencyDivision",
          foreignKey: "agentId",
          timestamps: false
        });

        Agent.hasMany(models.RepRequest);
      }
    },
    instanceMethods: {
      
      buildResponse: async function() {

        var models = this.sequelize.models

        var agentUser = await this.getUser();
        var agentAgencyDivisions = await this.getAgencyDivisions();
        var agentRosterTypes = await this.getRosterTypes();

        var agentJson = this.toJSON();
        agentJson.user = await agentUser.buildResponse();

        agentJson.rosterTypeId = agentRosterTypes.map(r => r.id);
        agentJson.rosterTypes = agentRosterTypes.map(r => r.name)

        agentJson.agencyDivisionId = agentAgencyDivisions.map(a => a.id);
        agentJson.agencyDivisions = agentAgencyDivisions.map(a => a.name);

        var agentActors = await this.getActors()
        
        var agentActorsJson = []
        for (var actor of agentActors) {
          var actorJson = await actor.buildResponse()
          agentActorsJson.push(actorJson)
        }
        agentJson.actors = agentActorsJson

        var modelsToQuery = ["Country", "City"]

        for (var model of modelsToQuery) {
          var modelString = String(model)
          var columnName = modelString.charAt(0).toLowerCase() + modelString.substr(1) + 'Id'

          if (agentJson[String(columnName)] === null) {
            agentJson[String(model)] = ''
          } else {
            var modelInstance = await models[modelString].findById(agentJson[String(columnName)])
            agentJson[String(model)] = modelInstance.name
          }
        }

        RemoveFields(agentJson.user, ["updatedAt", "createdAt", "password"])
        RemoveFields(agentJson, ["updatedAt", "createdAt"])

        return agentJson
      },
      createSession: async function() {
        // Create a token that will be used by the client
        // and required to authorize access to resources
        var user = await this.getUser();
        var token = jwt.sign({ id: this.id, roleId: user.roleId, baseId: user.id }, config.jwt_encryption, {
          expiresIn: 86400 // expires in 24 hours
        });
        return token;
      },
      fullProfile: async function() {

        var models = this.sequelize.models
        
        var fullAgent = await Agent.findById(this.id, {
          attributes: {
            exclude: ["createdAt", "updatedAt", "cityId", "countryId", "birthdate"]
          },
          include: [
            {
              model: models.Country,
              attributes: ["id", "name"],
              as: "country"
            },
            {
              model: models.City,
              attributes: ["id", "name"],
              as: "city"
            },
            {
              model: models.RosterType,
              attributes: ["id", "name"]
            },
            {
              model: models.AgencyDivision,
              attributes: ["id", "name"]
            }
          ]
        });

        return fullAgent
      }
    }
  });
  return Agent;
};