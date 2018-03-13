'use strict';

module.exports = (sequelize, DataTypes) => {
  const RosterType = sequelize.define('RosterType', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          RosterType.belongsToMany(models.Agent, {
            through: "Agent_RosterType",
            foreignKey: "RosterTypeId",
            timestamps: false
          })
        }
    } });
  return RosterType;
};
