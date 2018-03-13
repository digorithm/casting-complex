'use strict';

module.exports = (sequelize, DataTypes) => {
  const Credit = sequelize.define('Credit', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          Credit.belongsToMany(models.Actor, {
            through: "Actor_Credit",
            foreignKey: "creditId",
            timestamps: false
          })
        }
    } });
  return Credit;
};