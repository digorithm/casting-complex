'use strict';

module.exports = (sequelize, DataTypes) => {
  const AuditionRequest = sequelize.define('AuditionRequest', {
    comments: DataTypes.TEXT,
    isScheduled: DataTypes.BOOLEAN
  }, 
  { timestamps: false,
    classMethods: {
      associate: function(models) {

        AuditionRequest.belongsTo(models.Breakdown);
        
        AuditionRequest.belongsTo(models.BreakdownRole, {
          as: "role"
        });

        AuditionRequest.belongsTo(models.AuditionRequestStatus, {
          as: "status"
        });
        
        AuditionRequest.belongsTo(models.Actor);
      }
    }
  },
);
  return AuditionRequest;
}