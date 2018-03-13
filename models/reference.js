'use strict';

module.exports = (sequelize, DataTypes) => {
  const Reference = sequelize.define('Reference', {
    company: DataTypes.STRING,
    contactName: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {timestamps: false});
  return Reference;
};