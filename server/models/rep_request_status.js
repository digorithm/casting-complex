'use strict';

module.exports = (sequelize, DataTypes) => {
  const RepRequestStatus = sequelize.define('RepRequestStatus', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return RepRequestStatus;
};