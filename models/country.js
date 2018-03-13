'use strict';

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return Country;
};
