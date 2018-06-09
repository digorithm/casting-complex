'use strict';

module.exports = (sequelize, DataTypes) => {
  const SkillLevel = sequelize.define('SkillLevel', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return SkillLevel;
};