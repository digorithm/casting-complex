'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.belongsTo(models.Role, {
          as: "role"
        });

        // To get references just: user.getReferences(). Or set if you wanna add it.
        User.hasMany(models.Reference, {
          as: "References"
        });

        User.belongsToMany(models.Message, {
          through: models.MessageRecipient,
          foreignKey: "userId",
          timestamps: false
        });
      }
    }
  });
  return User;
};
