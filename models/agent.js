'use strict';

var moment = require('moment');
var utils  = require('../utils')

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
    profile: DataTypes.TEXT
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
      }
    },
    instanceMethods: {
      
      buildResponse: async function() {
        var agentUser = await this.getUser();
        var agentAgencyDivisions = await this.getAgencyDivisions();
        var agentRosterTypes = await this.getRosterTypes();

        var agentJson = this.toJSON();
        agentJson.user = agentUser.toJSON();
        agentJson.rosterTypeId = agentRosterTypes.map(r => r.id);
        agentJson.agencyDivisionId = agentAgencyDivisions.map(a => a.id);

        RemoveFields(agentJson.user, ["updatedAt", "createdAt", "password"])
        RemoveFields(agentJson, ["updatedAt", "createdAt"])

        return agentJson
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