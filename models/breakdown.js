'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Breakdown = sequelize.define('Breakdown', {
    name: DataTypes.STRING,
    requiresUnion: DataTypes.BOOLEAN,
    rates: DataTypes.STRING,
    contact: DataTypes.STRING,
    citiesForTransmission: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    storyline: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    shootingStartsWhen: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment(this.getDataValue('shootingStartsWhen')).format('YYYY-MM-DD');
      }
    },
    shootingEndsWhen: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment(this.getDataValue('shootingEndsWhen')).format('YYYY-MM-DD');
      }
    },
    submissionDeadline: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment(this.getDataValue('submissionDeadline')).format('YYYY-MM-DD');
      }
    },
    callbackDate: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment(this.getDataValue('callbackDate')).format('YYYY-MM-DD');
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
        Breakdown.belongsTo(models.AgencyDivision, {
          as: "mediaType"
        });
        
        Breakdown.hasMany(models.BreakdownRole, {
          as: "role"
        });
        
        Breakdown.hasMany(models.AuditionRequest);

      }
    }
  });
  return Breakdown;
};

