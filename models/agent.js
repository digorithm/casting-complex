'use strict';

var moment = require('moment');

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
      fullProfile: async function() {

        var models = this.sequelize.models
        
        var fullAgent = await Agent.findById(this.id, {
          attributes: {
            exclude: ["createdAt", "updatedAt", "cityId", "countryId"]
          },
          include: [
            {
              model: models.Actor,
              attributes: ["id", "firstName", "lastName"],
              through: {attributes: []}
            },
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