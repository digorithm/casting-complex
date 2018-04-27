'use strict';

var fs = require("fs");

var seeds = fs.readFileSync("./seeders/seed.json")

seeds = JSON.parse(seeds)

module.exports = {
  up: async function (queryInterface, Sequelize) {

    var Country = require('./../models').Country;

    await queryInterface.bulkInsert('Eyes', seeds["Eyes"])
      
    await queryInterface.bulkInsert('Hairs', seeds["Hairs"])
      
    await queryInterface.bulkInsert('Genders', seeds["Genders"])

    await queryInterface.bulkInsert('Ethnicities', seeds["Ethnicities"])

    await queryInterface.bulkInsert('Credits', seeds["Credits"])

    await queryInterface.bulkInsert('Unions', seeds["Unions"])

    await queryInterface.bulkInsert('RosterTypes', seeds["RosterTypes"])

    await queryInterface.bulkInsert('AgencyDivisions', seeds["AgencyDivisions"])
    
    await queryInterface.bulkInsert('CastingSpecializations', seeds["CastingSpecializations"])

    await queryInterface.bulkInsert('BreakdownStatuses', seeds["BreakdownStatuses"])

    await queryInterface.bulkInsert('AuditionStatuses', seeds["AuditionStatuses"])

    await queryInterface.bulkInsert('AuditionRequestStatuses', seeds["AuditionRequestStatuses"])

    var countries = JSON.parse(fs.readFileSync("./seeders/utils/countries.json"));

    // Add countries and their cities
    var cities = []
    for (let country in countries) {
      var added_country = await Country.create({ name: country })

      for (let city of countries[country]) {
        var obj = {name: city, countryId: added_country.id}
        cities.push(obj)
      }

      
    }
    await queryInterface.bulkInsert('Cities', cities);


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
