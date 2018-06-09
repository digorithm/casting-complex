'use strict';

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          Skill.belongsToMany(models.Actor, {
            through: "Actor_Skill",
            foreignKey: "skillId",
            timestamps: false
          })
        }
    } });
  return Skill;
};