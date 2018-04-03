'use strict';

var moment = require('moment');

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