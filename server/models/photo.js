'use strict';
module.exports = (sequelize, DataTypes) => {
  var Photo = sequelize.define('Photo', {
    path: DataTypes.STRING,
    isAvatar: {type: DataTypes.BOOLEAN, defaultValue: false}
  },
  { timestamps: false,
    classMethods: {
      associate: function(models) {
        
        Photo.belongsTo(models.User);
      }
    }
  });
  return Photo;
};