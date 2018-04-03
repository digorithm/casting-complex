'use strict';

module.exports = (sequelize, DataTypes) => {
  const BreakdownStatus = sequelize.define('BreakdownStatus', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return BreakdownStatus;
};
