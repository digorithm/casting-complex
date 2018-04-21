'use strict';

module.exports = (sequelize, DataTypes) => {
  const MessageRecipient = sequelize.define('MessageRecipient', {
    wasRead: DataTypes.BOOLEAN
  }, {timestamps: false});
  return MessageRecipient;
};

