'use strict';

module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    project: DataTypes.TEXT,
    role: DataTypes.TEXT,
    year: DataTypes.INTEGER
  }, 
  { timestamps: false,
    classMethods: {
      associate: function(models) {

        Experience.belongsTo(models.AgencyDivision, {
          as: "type"
        });
        
        Experience.belongsTo(models.Actor);
      }
    }
  },
);
  return Experience;
}