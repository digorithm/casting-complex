'use strict';

module.exports = (sequelize, DataTypes) => {
  const CastingSpecialization = sequelize.define('CastingSpecialization', {
    name: DataTypes.STRING,
  }, {timestamps: false,
      classMethods: {
        associate: function(models) {
          CastingSpecialization.belongsToMany(models.CastingDirector, {
            through: "CD_Specialization",
            foreignKey: "castingSpecializationId",
            timestamps: false
          })
        }
    } });
  return CastingSpecialization;
};

