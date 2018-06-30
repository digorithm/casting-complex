'use strict';

module.exports = (sequelize, DataTypes) => {
  const RepRequest = sequelize.define('RepRequest', {
  }, 
  { timestamps: false,
    classMethods: {
      associate: function(models) {
        RepRequest.belongsTo(models.RepRequestStatus, {
          as: "status"
        });
        RepRequest.belongsTo(models.Actor);
        RepRequest.belongsTo(models.Agent);
      }
    }
  },
);
  return RepRequest;
}