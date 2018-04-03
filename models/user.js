'use strict';

var bcrypt = require('bcryptjs');
var utils  = require('../utils')

var RemoveFields = utils.RemoveFields;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.belongsTo(models.Role, {
          as: "role"
        });

        User.hasMany(models.Reference, {
          as: "References"
        });

        User.belongsToMany(models.Message, {
          through: models.MessageRecipient,
          foreignKey: "userId",
          timestamps: false
        });
      }
    },
    instanceMethods: {
      buildResponse: async function () {
        var userJson = this.toJSON();
        RemoveFields(userJson, ["updatedAt", "createdAt", "password"]);
        return userJson
      }
    }
  });

  User.beforeCreate((user, options) => {
    user.password = bcrypt.hashSync(user.password, 8);
  });
  return User;
};
