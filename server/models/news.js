'use strict';
module.exports = (sequelize, DataTypes) => {
  var News = sequelize.define('News', {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  });
  return News;
};