'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gender = sequelize.define('Gender', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return Gender;
};
