'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    subject: DataTypes.STRING,
    messageBody: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Message.belongsTo(models.User, {
          as: "creator"
        });

        Message.belongsTo(models.Message, {
          as: "parent"
        });
        
        Message.belongsToMany(models.User, {
          as: "recipient",
          through: models.MessageRecipient,
          foreignKey: "messageId",
          timestamps: false
        });
      }
    }
  });
  return Message;
};

