'use strict';

module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          Language.belongsToMany(models.Actor, {
            through: "Actor_Language",
            foreignKey: "languageId",
            timestamps: false
          })
        }
    } });
  return Language;
};