'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles',
      [{name: 'Actor', createdAt: new Date(), updatedAt: new Date()},
       {name: 'Casting Director', createdAt: new Date(), updatedAt: new Date()},
       {name: 'Agent', createdAt: new Date(), updatedAt: new Date()},
       {name: 'Admin', createdAt: new Date(), updatedAt: new Date()}], {}); 
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
