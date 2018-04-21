'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ethnicity = sequelize.define('Ethnicity', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return Ethnicity;
};
