'use strict';

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          City.belongsTo(models.Country, {
            as: "country"
          });
        }
      }});
  return City;
};
