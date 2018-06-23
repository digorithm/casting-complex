'use strict';

module.exports = (sequelize, DataTypes) => {
  const BreakdownRole = sequelize.define('BreakdownRole', {
    name: DataTypes.STRING,
    ageRange: DataTypes.STRING,
    description: DataTypes.STRING
  }, {timestamps: false});
  return BreakdownRole;
};
