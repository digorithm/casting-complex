'use strict';

module.exports = (sequelize, DataTypes) => {
  const AuditionRequestStatus = sequelize.define('AuditionRequestStatus', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return AuditionRequestStatus;
};