'use strict';

var assert = require('assert');
var moment = require('moment');
var _ = require('lodash');

describe('Database testing', function () {
  before(async function () {
    await require('../../models').sequelize.sync({force: true});
    this.User = await require('../../models').User;
    this.Role = await require('../../models').Role;
    this.Actor = await require('../../models').Actor;
    this.Eye = await require('../../models').Eye;
    this.Hair = await require('../../models').Hair;
    this.Gender = await require('../../models').Gender;
    this.Ethnicity = await require('../../models').Ethnicity;
    this.Credit= await require('../../models').Credit;
    this.Union = await require('../../models').Union;
    this.Country= await require('../../models').Country;
    this.City = await require('../../models').City;
    this.Agent = await require('../../models').Agent;
    this.RosterType = await require('../../models').RosterType;
    this.AgencyDivision = await require('../../models').AgencyDivision;
    this.CastingDirector = await require('../../models').CastingDirector
    this.CastingSpecialization = await require('../../models').CastingSpecialization
    this.Message = await require('../../models').Message
    this.Breakdown = await require('../../models').Breakdown
    this.BreakdownRole = await require('../../models').BreakdownRole
    this.Audition = await require('../../models').Audition
    this.AuditionStatus = await require('../../models').AuditionStatus
    this.AuditionRequest = await require('../../models').AuditionRequest
    this.AuditionRequestStatus = await require('../../models').AuditionRequestStatus
  });

  beforeEach(async function () {
    

  });

  describe('Users', function () {

    it('creates a role', async function() {
        var role = await this.Role.create({ name: 'actor'})
        assert.equal(role.name, 'actor');
    });

    it('creates a user with role', async function () {
      var role = await this.Role.create({ name: 'actor' })

      var user = await this.User.create({ username: 'john doe', roleId: role.id, email:"test@gmail.com", password: "123" })
       assert.equal(user.username, 'john doe')
    });
    
    it('creates an actor', async function () {

      const expected = {"birthdate":"1993-06-08","id":1,"firstName":"John","middleName":"Actor","lastName":"Doe","legalName":"John Doe","streetAddress":"5775 Toronto Road","phone":"778 320 9600","mobile":"778 320 9600","suite":"1005","isRepresented":false,"height":1.78,"weight":174,"profile":"A very passionate actor","userId":2,"Agents":[],"country":{"id":1,"name":"Brazil"},"city":{"id":1,"name":"Salvador"},"Credits":[{"id":1,"name":"Actor"},{"id":2,"name":"Dancer"}],"Unions":[{"id":1,"name":"CAEA"},{"id":2,"name":"EQUITY"}],"ethnicity":{"id":1,"name":"Caucasian"},"gender":{"id":1,"name":"Male"},"hair":{"id":1,"name":"blonde"},"eye":{"id":1,"name":"black"}};

      var role = await this.Role.create({ name: 'actor' })

      var user = await this.User.create({ username: 'john actor', roleId: role.id, email:"testactor@gmail.com", password: "123" })

      var eye = await this.Eye.create({ name: "black" })

      var hair = await this.Hair.create({ name: "blonde" })

      var gender = await this.Gender.create({ name: "Male" })

      var ethnicity = await this.Ethnicity.create({ name: "Caucasian" })

      var credit_1 = await this.Credit.create({ name: "Actor" })

      var credit_2 = await this.Credit.create({ name: "Dancer" })

      var union_1 = await this.Union.create({ name: "CAEA" })

      var union_2 = await this.Union.create({ name: "EQUITY" })
      
      var country = await this.Country.create({name: "Brazil"})
      var city = await this.City.create({name: "Salvador", countryId: country.id})

      // Idea: pass json to create, easier to test the expect this way...

      var actor = await this.Actor.create({
        firstName: "John",
        middleName: "Actor",
        lastName: "Doe",
        legalName: "John Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        suite: "1005",
        isRepresented: false,
        height: 1.78,
        weight: 174,
        birthdate: new Date("1993-06-08"),
        profile: "A very passionate actor",
        userId: user.id,
        eyeId: eye.id,
        genderId: gender.id,
        hairId: hair.id,
        ethnicityId: ethnicity.id,
        countryId: country.id,
        cityId: city.id
      })

      await actor.setCredits([credit_1, credit_2])
      await actor.setUnions([union_1, union_2])

      const actual = await actor.fullProfile()

      assert.deepEqual(JSON.stringify(actual), JSON.stringify(expected))
    });
    
    it('creates an agent', async function () {

      const expected = {"id":1,"firstName":"Agent","middleName":"Middle","lastName":"Doe","streetAddress":"5775 Toronto Road","phone":"778 320 9600","mobile":"778 320 9600","position":"Manager","agencyName":"Doe and company","zipPostal":"VVV VVV","website":"coolwebsite.com","sizeOfRoster":30,"profile":"Hiring Actors!","userId":3,"country":{"id":2,"name":"Canada"},"city":{"id":2,"name":"Vancouver"},"RosterTypes":[{"id":1,"name":"Actors","Agent_RosterType":{"agentId":1,"RosterTypeId":1}},{"id":2,"name":"Musicians","Agent_RosterType":{"agentId":1,"RosterTypeId":2}}],"AgencyDivisions":[{"id":1,"name":"On-camera","Agent_AgencyDivision":{"AgencyDivisionId":1,"agentId":1}},{"id":2,"name":"Celebrity","Agent_AgencyDivision":{"AgencyDivisionId":2,"agentId":1}}]}

      var role = await this.Role.create({ name: 'agent' });

      var user = await this.User.create({ username: 'Agent Doe', roleId: role.id, email:"testAgent@gmail.com", password: "123" });
      
      var country = await this.Country.create({name: "Canada"});
      var city = await this.City.create({name: "Vancouver", countryId: country.id});
      
      var agent = await this.Agent.create({
        firstName: "Agent",
        middleName: "Middle",
        lastName: "Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        profile: "Hiring Actors!",
        userId: user.id,
        countryId: country.id,
        cityId: city.id,
        sizeOfRoster: 30,
        zipPostal: "VVV VVV",
        website: "coolwebsite.com",
        agencyName: "Doe and company",
        position: "Manager",
      })

      // Note that we are using the actor created in the previous test, not the best practice, but... technical debt incurred.
      var returned_actor = await this.Actor.findAll();
      await agent.setActors([returned_actor[0]]);
      
      var rosterType_1 = await this.RosterType.create({ name: "Actors" })
      var rosterType_2 = await this.RosterType.create({ name: "Musicians" })
      await agent.setRosterTypes([rosterType_1, rosterType_2])
      
      var agencyDivision_1 = await this.AgencyDivision.create({ name: "On-camera" })
      var agencyDivision_2 = await this.AgencyDivision.create({ name: "Celebrity" })
      await agent.setAgencyDivisions([agencyDivision_1, agencyDivision_2])
      
      var fullAgent = await agent.fullProfile()

      assert.equal(JSON.stringify(fullAgent), JSON.stringify(expected))

      var agentActor = await agent.getActors()

      var agentActorJSON = agentActor[0].toJSON()

      delete agentActorJSON["Agent_Actor"]
      delete returned_actor[0]["Agent_Actor"]

      assert.equal(JSON.stringify(agentActorJSON), JSON.stringify(returned_actor[0].toJSON()))
    });
    
    it('creates a casting director', async function () {

      const expected = {"id":1,"firstName":"Casting","middleName":"Director","lastName":"Doe","streetAddress":"5775 Toronto Road","phone":"778 320 9600","mobile":"778 320 9600","position":"Director","companyName":"The Casting Company","zipPostal":"VVV VVV","website":"coolwebsite.com","profile":"Hiring Actors!","userId":4,"country":{"id":3,"name":"Canada"},"city":{"id":3,"name":"Vancouver"},"CastingSpecializations":[{"id":1,"name":"Film"},{"id":2,"name":"General"}]};

      var role = await this.Role.create({ name: 'casting director' });

      var user = await this.User.create({ username: 'Casting director Doe', roleId: role.id, email:"testCastingDirector@gmail.com", password: "123" });
      
      var country = await this.Country.create({name: "Canada"});
      var city = await this.City.create({name: "Vancouver", countryId: country.id});
      
      var castingDirector = await this.CastingDirector.create({
        firstName: "Casting",
        middleName: "Director",
        lastName: "Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        profile: "Hiring Actors!",
        userId: user.id,
        countryId: country.id,
        cityId: city.id,
        zipPostal: "VVV VVV",
        website: "coolwebsite.com",
        companyName: "The Casting Company",
        position: "Director",
      })
      
      var spec1 = await this.CastingSpecialization.create({ name: "Film" })
      var spec2 = await this.CastingSpecialization.create({ name: "General" })
      await castingDirector.setCastingSpecializations([spec1, spec2])
      
      var fullCastingDirector = await castingDirector.fullProfile()

      assert.deepEqual(JSON.stringify(fullCastingDirector), JSON.stringify(expected))
    });
    
  });
  
  describe('Messaging', function() {
    it('should send a simple message between 2 users', async function() {
      
      var actorRole = await this.Role.create({ name: 'actor' });
      var agentRole = await this.Role.create({ name: 'agent' });

      var actorUser = await this.User.create({ username: 'actor doe', roleId: actorRole.id, email:"test@gmail.com", password: "123" });
      
      var agentUser = await this.User.create({ username: 'agent doe', roleId: agentRole.id, email:"test@gmail.com", password: "123" });

      var message = await this.Message.create({subject: "Just a message", messageBody: "This is the body of the message"})

      await message.setCreator(actorUser);
      await message.setRecipient(agentUser);

      var creator = await message.getCreator();
      assert.equal("actor doe", creator.username);

      var recipient = await message.getRecipient();
      assert.equal("agent doe", recipient[0].username);

      var agentReadMessage = await agentUser.getMessages()

      assert.equal("This is the body of the message",
                    agentReadMessage[0].messageBody)
    });
    
    it('should send a simple message from 1 user to 2 users', async function() {
      
      var actorRole = await this.Role.create({ name: 'actor' });
      var agentRole = await this.Role.create({ name: 'agent' });
      var castingDirectorRole = await this.Role.create({ name: 'casting director' });

      var actorUser = await this.User.create({ username: 'actor doe', roleId: actorRole.id, email:"test@gmail.com", password: "123" });
      
      var agentUser = await this.User.create({ username: 'agent doe', roleId: agentRole.id, email:"test@gmail.com", password: "123" });

      var castingDirectorUser = await this.User.create({ username: 'casting director doe', roleId: castingDirectorRole.id, email:"test@gmail.com", password: "123" });

      var message = await this.Message.create({subject: "Just a message", messageBody: "This is the body of the message"})

      await message.setCreator(actorUser);
      await message.setRecipient([castingDirectorUser, agentUser]);

      var creator = await message.getCreator()
      var recipient = await message.getRecipient()

      assert.equal("actor doe", creator.username);
      assert.equal("agent doe", recipient[0].username);
      assert.equal("casting director doe", recipient[1].username);

      var agentReadMessage = await agentUser.getMessages()

      assert.equal("This is the body of the message",
                    agentReadMessage[0].messageBody)

      var castingDirectorReadMessage = await castingDirectorUser.getMessages()
      
      assert.equal("This is the body of the message",
                    castingDirectorReadMessage[0].messageBody)

    });
    
    it('should send a message from user 1 to user 2, and user 2 should reply to this message', async function() {
      
      var actorRole = await this.Role.create({ name: 'actor' });
      var agentRole = await this.Role.create({ name: 'agent' });

      var actorUser = await this.User.create({ username: 'actor doe', roleId: actorRole.id, email:"test@gmail.com", password: "123" });
      
      var agentUser = await this.User.create({ username: 'agent doe', roleId: agentRole.id, email:"test@gmail.com", password: "123" });

      var message = await this.Message.create({subject: "Just a message", messageBody: "This is the body of the message"})

      await message.setCreator(actorUser);
      await message.setRecipient([agentUser]);

      var creator = await message.getCreator()
      var recipient = await message.getRecipient()

      assert.equal("actor doe", creator.username);
      assert.equal("agent doe", recipient[0].username);

      var agentReadMessage = await agentUser.getMessages()

      assert.equal("This is the body of the message",
                    agentReadMessage[0].messageBody)

      var message2 = await this.Message.create({subject: "RE: Just a message", messageBody: "Replying to the previous message"})

      await message2.setCreator(agentUser);
      await message2.setRecipient([actorUser]);
      await message2.setParent(message);

      var actorReadMessage = await actorUser.getMessages()
      
      assert.equal("Replying to the previous message",
                    actorReadMessage[0].messageBody);
      
      var parent = await actorReadMessage[0].getParent();
      
      assert.equal("This is the body of the message",
                    parent.messageBody);

    });

  });


  describe('Job board', function() {

    it("Casting director should submit a breakdown with 2 roles", async function() {

      var castingDirectorRole = await this.Role.create({ name: 'casting director' });

      var castingDirectorUser = await this.User.create({ username: 'casting director doe', roleId: castingDirectorRole.id, email:"test@gmail.com", password: "123" });

      var country = await this.Country.create({name: "Canada"});
      var city = await this.City.create({name: "Vancouver", countryId: country.id});
      
      var castingDirector = await this.CastingDirector.create({
        firstName: "Casting",
        middleName: "Director",
        lastName: "Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        profile: "Hiring Actors!",
        userId: castingDirectorUser.id,
        countryId: country.id,
        cityId: city.id,
        zipPostal: "VVV VVV",
        website: "coolwebsite.com",
        companyName: "The Casting Company",
        position: "Director",
      })
      
      var spec1 = await this.CastingSpecialization.create({ name: "Film" })
      var spec2 = await this.CastingSpecialization.create({ name: "General" })
      await castingDirector.setCastingSpecializations([spec1, spec2])
      
      var breakdown = await this.Breakdown.create({
        name: "The coolest tv show",
        requiresUnion: true,
        rates: "$500 per hour",
        contact: "send an email to test@gmail.com with the subject TVSHOW",
        citiesForTransmission: "Vancouver, Toronto, Quebec",
        synopsis: "The synopsis for this tv show",
        storyline: "The storyline for this tv show",
        comments: "Some long comment about this project",
        shootingStartsWhen: new Date("2018-06-08"),
        shootingEndsWhen: new Date("2018-06-24"),
        submissionDeadline: new Date("2018-06-01"),
        callbackDate: new Date("2018-06-03"),
        CastingDirectorId: castingDirector.id
      });

      // You can either set the breakdown casting director ID in the create or through this method
      await castingDirector.setBreakdown([breakdown]);

      var mediaType = await this.AgencyDivision.create({ name: "Television" });

      await breakdown.setMediaType(mediaType);

      var role1 = await this.BreakdownRole.create({ageRange: "between 18 and 24", description: "Description of role 1"})

      var role2 = await this.BreakdownRole.create({ageRange: "between 28 and 34", description: "Description of role 2"})

      await breakdown.setRole([role1, role2])

      var breakdownFromCastingDirector = await castingDirector.getBreakdown();

      Object.keys(breakdown.dataValues).forEach((k) => {
        if ((k != "updatedAt") && (k != "createdAt")) {
          assert.equal(breakdown[k], breakdownFromCastingDirector[0][k])
        }
      });

      var roles = await breakdownFromCastingDirector[0].getRole();

      assert.equal(roles[0].ageRange, "between 18 and 24");
      assert.equal(roles[1].ageRange, "between 28 and 34");
      assert.equal(roles[0].description, "Description of role 1");
      assert.equal(roles[1].description, "Description of role 2");
      assert.equal(roles[0].BreakdownId, 1)
      assert.equal(roles[1].BreakdownId, 1)

    });

    it("Actor should be able to request audition to a role in a breakdown, and casting director should be able to accept and schedule audition", async function() {
      
      var role = await this.Role.create({ name: 'actor' })

      var castingDirectorRole = await this.Role.create({ name: 'casting director' })

      var user = await this.User.create({ username: 'Rodrigo Actor', roleId: role.id, email:"rodActor@gmail.com", password: "123" })

      var eye = await this.Eye.create({ name: "black" })

      var hair = await this.Hair.create({ name: "blonde" })

      var gender = await this.Gender.create({ name: "Male" })

      var ethnicity = await this.Ethnicity.create({ name: "Caucasian" })

      var credit_1 = await this.Credit.create({ name: "Actor" })

      var credit_2 = await this.Credit.create({ name: "Dancer" })

      var union_1 = await this.Union.create({ name: "CAEA" })

      var union_2 = await this.Union.create({ name: "EQUITY" })
      
      var country = await this.Country.create({name: "Brazil"})
      var city = await this.City.create({name: "Salvador", countryId: country.id})

      var actor = await this.Actor.create({
        firstName: "Rodrigo",
        middleName: "Actor",
        lastName: "Doe",
        legalName: "Rodrigo Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        suite: "1005",
        isRepresented: false,
        height: 1.78,
        weight: 174,
        birthdate: new Date("1993-06-08"),
        profile: "A very passionate actor",
        userId: user.id,
        eyeId: eye.id,
        genderId: gender.id,
        hairId: hair.id,
        ethnicityId: ethnicity.id,
        countryId: country.id,
        cityId: city.id
      })

      await actor.setCredits([credit_1, credit_2])
      await actor.setUnions([union_1, union_2])

      var castingDirectorUser = await this.User.create({ username: 'casting director Rodrigo', roleId: castingDirectorRole.id, email:"test2@gmail.com", password: "123" });

      var castingDirector = await this.CastingDirector.create({
        firstName: "Casting",
        middleName: "Director",
        lastName: "Doe",
        streetAddress: "5775 Toronto Road",
        phone: "778 320 9600",
        mobile: "778 320 9600",
        profile: "Hiring Actors!",
        userId: castingDirectorUser.id,
        countryId: country.id,
        cityId: city.id,
        zipPostal: "VVV VVV",
        website: "coolwebsite.com",
        companyName: "The Casting Company",
        position: "Director",
      })
      
      var spec1 = await this.CastingSpecialization.create({ name: "Film" })
      var spec2 = await this.CastingSpecialization.create({ name: "General" })
      await castingDirector.setCastingSpecializations([spec1, spec2])
      
      // Creating breakdown
      var breakdown = await this.Breakdown.create({
        name: "The nicest tv show",
        requiresUnion: true,
        rates: "$500 per hour",
        contact: "send an email to test@gmail.com with the subject TVSHOW",
        citiesForTransmission: "Vancouver, Toronto, Quebec",
        synopsis: "The synopsis for this tv show",
        storyline: "The storyline for this tv show",
        comments: "Some long comment about this project",
        shootingStartsWhen: new Date("2018-06-08"),
        shootingEndsWhen: new Date("2018-06-24"),
        submissionDeadline: new Date("2018-06-01"),
        callbackDate: new Date("2018-06-03"),
        CastingDirectorId: castingDirector.id
      });
      await castingDirector.setBreakdown([breakdown]);
      var mediaType = await this.AgencyDivision.create({ name: "Television" });
      await breakdown.setMediaType(mediaType);
      var role1 = await this.BreakdownRole.create({ageRange: "between 18 and 24", description: "Description of role 1"})
      var role2 = await this.BreakdownRole.create({ageRange: "between 28 and 34", description: "Description of role 2"})
      await breakdown.setRole([role1, role2])

      // Creating audition request
      var requestStatus = await this.AuditionRequestStatus.create({name: "Pending"})
      
      var acceptedStatus = await this.AuditionRequestStatus.create({name: "Accepted"})

      var auditionRequest = await this.AuditionRequest.create({roleId: role1.id, comments: "accept me pls", BreakdownId: breakdown.id, statusId: requestStatus.id})

      // Requests an audition
      await actor.setAuditionRequests([auditionRequest])

      // TODO: Assert that casting director can get their breakdown, get its requests, and approve them

      var breakdownFromCastingDirector = await castingDirector.getBreakdown()

      var requestFromBreakdown = await breakdownFromCastingDirector[0].getAuditionRequests()
      
      // Accept the request
      await requestFromBreakdown[0].setStatus(acceptedStatus)

      // Check that it was accepted
      var requestFromActor = await actor.getAuditionRequests()
      assert.equal(requestFromActor[0].statusId, acceptedStatus.id)

      // Then create/schedule audition
      var status = await this.AuditionStatus.create({name: "Active"});

      var audition = await this.Audition.create({
        address: "Address of the audition",
        comments: "Some comments",
        startsWhen: new Date("March 20, 2018 09:30:00"),
        endsWhen: new Date("March 20, 2018 11:30:00"),
        breakdownId: breakdown.id,
        statusId: status.id,
        ActorId: actor.id 
      })

      var auditionFromActor = await actor.getAuditions()

      assert.equal(true, _.isEqual(audition.toJSON(), auditionFromActor[0].toJSON()))

    });

  });



  });
