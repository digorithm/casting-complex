'use strict';

module.exports = (sequelize, DataTypes) => {
  const AgencyDivision = sequelize.define('AgencyDivision', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          AgencyDivision.belongsToMany(models.Agent, {
            through: "Agent_AgencyDivision",
            foreignKey: "AgencyDivisionId",
            timestamps: false
          })
        }
    } });
  return AgencyDivision;
};
