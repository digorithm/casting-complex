'use strict';

var bcrypt = require('bcryptjs');
var utils  = require('../utils')
var jwt = require('jsonwebtoken');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];

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
      },
      createSession: async function() {
        // Create a token that will be used by the client
        // and required to authorize access to resources
        var token = jwt.sign({ id: this.id }, config.jwt_encryption, {
          expiresIn: 86400 // expires in 24 hours
        });
        return token;
      }
    }
  });

  User.beforeCreate((user, options) => {
    // Hash password before inserting into the database
    user.password = bcrypt.hashSync(user.password, 8);
  });
  return User;
};
