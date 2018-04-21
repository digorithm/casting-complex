'use strict';

module.exports = (sequelize, DataTypes) => {
  const BreakdownRole = sequelize.define('BreakdownRole', {
    ageRange: DataTypes.STRING,
    description: DataTypes.STRING
  }, {timestamps: false});
  return BreakdownRole;
};
