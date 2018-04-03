'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Audition = sequelize.define('Audition', {
    address: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    startsWhen: {
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('startsWhen')).format('MMMM Do YYYY, h:mm:ss a');
      }
    },
    endsWhen: {
      type: DataTypes.DATE,
      get: function() {
        return moment(this.getDataValue('endsWhen')).format('MMMM Do YYYY, h:mm:ss a');
      }
    }
  }, 
  { timestamps: false,
    classMethods: {
      associate: function(models) {

        Audition.belongsTo(models.Breakdown, {
          as: "breakdown"
        });
        
        Audition.belongsTo(models.AuditionStatus, {
          as: "status"
        });
        
        Audition.belongsTo(models.Actor, {
          as: "Actor"
        });

      }
    }
  },
);
  return Audition;
};