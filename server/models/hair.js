'use strict';

module.exports = (sequelize, DataTypes) => {
  const Hair = sequelize.define('Hair', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return Hair;
};
