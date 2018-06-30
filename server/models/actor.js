'use strict';

var moment = require('moment');
var utils  = require('../utils')
var jwt = require('jsonwebtoken');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];

var RemoveFields = utils.RemoveFields;

module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define('Actor', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    legalName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    zipPostal: DataTypes.STRING,
    phone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    suite: DataTypes.STRING,
    isRepresented: DataTypes.BOOLEAN,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    age: DataTypes.INTEGER,
    birthdate: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment(this.getDataValue('birthdate')).format('YYYY-MM-DD');
      }
    },
    profile: DataTypes.TEXT
  }, {
    associations: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Actor.belongsTo(models.User, {
          as: "user",
          onDelete: 'CASCADE'
        });

        Actor.belongsTo(models.Eye, {
          as: "eye"
        });
        
        Actor.belongsTo(models.Hair, {
          as: "hair"
        });
        
        Actor.belongsTo(models.Gender, {
          as: "gender",
          allowNull: false
        });
        
        Actor.belongsTo(models.Ethnicity, {
          as: "ethnicity"
        });

        Actor.belongsToMany(models.Language, {
          through: "Actor_Language",
          foreignKey: "ActorId",
          timestamps: false
        });

        Actor.belongsToMany(models.Skill, {
          through: "Actor_Skill",
          foreignKey: "ActorId",
          timestamps: false
        });

        Actor.belongsToMany(models.Credit, {
          through: "Actor_Credit",
          foreignKey: "actorId",
          timestamps: false
        });

        Actor.belongsToMany(models.Union, {
          through: "Actor_Union",
          foreignKey: "actorId",
          timestamps: false
        });
        
        Actor.belongsToMany(models.Agent, {
          through: "Agent_Actor",
          foreignKey: "actorId",
          timestamps: false
        });
        
        Actor.belongsTo(models.Country, {
          as: "country"
        });
        
        Actor.belongsTo(models.City, {
          as: "city"
        });
        
        Actor.hasMany(models.AuditionRequest);

        Actor.hasMany(models.Audition);

        Actor.hasMany(models.Experience);

        Actor.hasOne(models.RepRequest);
      }
    },
    instanceMethods: {

      buildResponse: async function() {

        // This builds the full actor's profile response. All data in here is public to any user, it is what it's used on the actor's public profile.

        var models = this.sequelize.models

        var actorUser = await this.getUser();
        var actorCredits = await this.getCredits();
        var actorUnions = await this.getUnions();
        var actorLanguages = await this.getLanguages();
        var actorSkills = await this.getSkills()
        
        var actorExperiences = await this.getExperiences()
        
        var experiences = []
        // Get experience type's name, which is the same as Agency Division names
        for (var experience of actorExperiences) {
          var experienceJson = await experience.toJSON()
          var modelInstance = await models.AgencyDivision.findById(experience.typeId)
          experienceJson.type = modelInstance.name
          experiences.push(experienceJson)
        }

        var actorJson = this.toJSON();
        actorJson.user = await actorUser.buildResponse();

        actorJson.Experiences = experiences;
        
        actorJson.languageId = actorLanguages.map(l => l.id);
        actorJson.Languages = actorLanguages.map(l => l.name);
        
        actorJson.Skills = actorSkills.map(s => s.name);
        actorJson.skillId = actorSkills.map(s => s.id);

        actorJson.creditId = actorCredits.map(c => c.id);
        actorJson.Credits = actorCredits.map(c => c.name);

        actorJson.unionId = actorUnions.map(u => u.id);
        actorJson.Unions = actorUnions.map(u => u.name);


        if (this.isRepresented) {
          var agent = await this.getAgents()
          var agentUser = await agent[0].getUser();

          var agentInfo = {
            name: agent[0].firstName + ' ' + agent[0].lastName,
            username: agentUser.username,
            agencyName: agent[0].agencyName
          }
          actorJson.agent = agentInfo
        }

        var modelsToQuery = ["Country", "City", "Ethnicity", "Eye", "Hair", "Gender"]

        for (var model of modelsToQuery) {
          var modelString = String(model)
          var columnName = modelString.charAt(0).toLowerCase() + modelString.substr(1) + 'Id'

          if (actorJson[String(columnName)] === null) {
            actorJson[String(model)] = ''
          } else {
            var modelInstance = await models[modelString].findById(actorJson[String(columnName)])
            actorJson[String(model)] = modelInstance.name
          }
        }

        RemoveFields(actorJson.user, ["updatedAt", "createdAt", "password"])
        RemoveFields(actorJson, ["updatedAt", "createdAt"])
        return actorJson
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
        
        var fullActor = await Actor.findById(this.id, {
          attributes: {
            exclude: ["createdAt", "updatedAt", "cityId", "countryId", "eyeId", "genderId", "hairId", "ethnicityId"]
          },
          include: [
            {
              model: models.Agent,
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
              model: models.Credit,
              attributes: ["id", "name"],
              through: {attributes: []}
            },
            {
              model: models.Union,
              attributes: ["id", "name"],
              through: {attributes: []}
            },
            {
              model: models.Ethnicity,
              attributes: ["id", "name"],
              as: "ethnicity"
            },
            {
              model: models.Gender,
              attributes: ["id", "name"],
              as: "gender"
            },
            {
              model: models.Hair,
              attributes: ["id", "name"],
              as: "hair"
            },
            {
              model: models.Eye,
              attributes: ["id", "name"],
              as: "eye"
            }
          ]
        });

        return fullActor
      }
    }
  });
  return Actor;
};
