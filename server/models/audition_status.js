'use strict';

module.exports = (sequelize, DataTypes) => {
  const AuditionStatus = sequelize.define('AuditionStatus', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return AuditionStatus;
};