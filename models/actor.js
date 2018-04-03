'use strict';

var moment = require('moment');
var utils  = require('../utils')

var RemoveFields = utils.RemoveFields;

module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define('Actor', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    legalName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    phone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    suite: DataTypes.STRING,
    isRepresented: DataTypes.BOOLEAN,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
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
      }
    },
    instanceMethods: {

      buildResponse: async function() {
        var actorUser = await this.getUser();
        var actorCredits = await this.getCredits();
        var actorUnions = await this.getUnions();

        var actorJson = this.toJSON();
        actorJson.user = actorUser.toJSON();
        actorJson.creditId = actorCredits.map(c => c.id);
        actorJson.unionId = actorUnions.map(u => u.id);

        RemoveFields(actorJson.user, ["updatedAt", "createdAt", "password"])
        RemoveFields(actorJson, ["updatedAt", "createdAt"])

        return actorJson
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