'use strict';

var moment = require('moment');
var utils  = require('../utils')
var jwt = require('jsonwebtoken');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];

var RemoveFields = utils.RemoveFields;


module.exports = (sequelize, DataTypes) => {
  const CastingDirector = sequelize.define('CastingDirector', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    phone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    position: DataTypes.STRING,
    companyName: DataTypes.STRING,
    zipPostal: DataTypes.STRING,
    website: DataTypes.STRING,
    profile: DataTypes.TEXT
  }, {
    associations: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        CastingDirector.belongsTo(models.User, {
          as: "user"
        });
        
        CastingDirector.belongsTo(models.Country, {
          as: "country"
        });
        
        CastingDirector.belongsTo(models.City, {
          as: "city"
        });
        
        CastingDirector.belongsToMany(models.CastingSpecialization, {
          through: "CD_Specialization",
          foreignKey: "castingDirectorId",
          timestamps: false
        });
        
        CastingDirector.hasMany(models.Breakdown, {
          as: "breakdown"
        });
      }
    },
    instanceMethods: {
    
      buildResponse: async function() {
        var castingDirectorUser = await this.getUser();
        var castingDirectorSpecializations = await this.getCastingSpecializations();

        var castingDirectorJson = this.toJSON();
        castingDirectorJson.user = castingDirectorUser.toJSON();
        castingDirectorJson.specializationId = castingDirectorSpecializations.map(s => s.id);

        RemoveFields(castingDirectorJson.user, ["updatedAt", "createdAt", "password"])
        RemoveFields(castingDirectorJson, ["updatedAt", "createdAt"])

        return castingDirectorJson
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
        
        var fullCastingDirector = await models.CastingDirector.findById(this.id, {
          attributes: {
            exclude: ["createdAt", "updatedAt", "cityId", "countryId"]
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
              model: models.CastingSpecialization,
              attributes: ["id", "name"],
              through: {attributes: []}
            }
          ]
        });

        return fullCastingDirector
      }
    }
  });
  return CastingDirector;
};