'use strict';

module.exports = (sequelize, DataTypes) => {
  const CastingCredit = sequelize.define('CastingCredit', {
    credit: DataTypes.STRING,
    contact: DataTypes.STRING
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          CastingCredit.belongsTo(models.CastingDirector, { as: "castingDirector"})
      }
    }
  });
  return CastingCredit;
};