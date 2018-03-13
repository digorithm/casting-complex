'use strict';

module.exports = (sequelize, DataTypes) => {
  const Union = sequelize.define('Union', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          Union.belongsToMany(models.Actor, {
            through: "Actor_Union",
            foreignKey: "unionId",
            timestamps: false
          })
        }
    } });
  return Union;
};