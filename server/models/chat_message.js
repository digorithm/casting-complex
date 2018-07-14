'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    message: DataTypes.TEXT,
    read: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        ChatMessage.belongsTo(models.User, {
          as: "from"
        });

        ChatMessage.belongsTo(models.User, {
          as: "to"
        });
      }
    }
  });
  return ChatMessage;
};

