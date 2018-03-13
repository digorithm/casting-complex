'use strict';

module.exports = (sequelize, DataTypes) => {
  const Eye = sequelize.define('Eye', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  return Eye;
};
