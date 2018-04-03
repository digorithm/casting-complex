'use strict';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
var assert = require('assert');
var moment = require('moment');
var _ = require('lodash');

chai.use(chaiHttp);

describe('API Routes testing', function () {
  after(async function () {
    await require('../../models').sequelize.sync({force: true});
  });

  beforeEach(async function () {
  });

  describe('User, Actors, Agents, and Casting Directors CRUD', function () {

    it('should get all users with empty database', (done) => {
      chai.request(server)
          .get('/users')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(0);
            done();
          });
    });

    it('should get all actors with empty database', (done) => {
      chai.request(server)
          .get('/actors')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(0);
            done();
          });
    });

    it('should sign up a new actor and get this actor', (done) => {

      var actor = {
        "user": {
          "username": "digorithm",
          "email": "rod.dearaujo@gmail.com",
          "roleId": 1,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "legalName": "rodrigo araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "suite": "1005",
        "isRepresented": false,
        "height": 178,
        "weight": 174,
        "birthdate": moment(new Date("06-08-1993")).format('YYYY-MM-DD'),
        "profile": "Just an actor",
        "eyeId": 1,
        "hairId": 1,
        "genderId": 1,
        "ethnicityId": 1,
        "countryId": 1,
        "cityId": 1,
        "creditId": [
          1,
          2
        ],
        "unionId": [
          3,
          4
        ]
      }

      var expectedResponse = {
        "user": {
          "username": "digorithm",
          "email": "rod.dearaujo@gmail.com",
          "roleId": 1,
          "id": 1
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "legalName": "rodrigo araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "suite": "1005",
        "isRepresented": false,
        "height": 178,
        "weight": 174,
        "birthdate": moment(new Date("06-08-1993")).format('YYYY-MM-DD'),
        "profile": "Just an actor",
        "eyeId": 1,
        "hairId": 1,
        "genderId": 1,
        "ethnicityId": 1,
        "countryId": 1,
        "cityId": 1,
        "creditId": [
          1,
          2
        ],
        "unionId": [
          3,
          4
        ],
        "userId": 1,
        "id": 1
      }

      chai.request(server)
          .post('/actors')
          .send(actor)
          .end((err, res) => {
              console.log(actor);
              console.log(expectedResponse);
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              res.body.data.should.deep.equal(expectedResponse)
              chai.request(server)
                .get('/actors/' + res.body.data.id)
                .end((err, res) => {
                    res.body.data.should.deep.equal(expectedResponse)
                    done();
              });
          });

      
    });

    it('should try to signup an existing actor and fail', (done) => {

      var alreadyExistentActor = {
        "user": {
          "username": "digorithm",
          "email": "rod.dearaujo@gmail.com",
          "roleId": 1,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "legalName": "rodrigo araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "suite": "1005",
        "isRepresented": false,
        "height": 178,
        "weight": 174,
        "birthdate": moment(new Date("06-08-1993")).format('YYYY-MM-DD'),
        "profile": "Just an actor",
        "eyeId": 1,
        "hairId": 1,
        "genderId": 1,
        "ethnicityId": 1,
        "countryId": 1,
        "cityId": 1,
        "creditId": [
          1,
          2
        ],
        "unionId": [
          3,
          4
        ]
      }

      chai.request(server)
          .post('/actors')
          .send(alreadyExistentActor)
          .end((err, res) => {
              res.should.have.status(400);
              res.body.should.have.property("success").equal(false)
              res.body.should.have.property("error").equal("username must be unique!")
              
            done();
          });
    });
    
    it('should get all actors with one created actor', (done) => {
      chai.request(server)
          .get('/actors')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
            done();
          });
    });

    it('should update fields of a user account', (done) => {

      // TODO: prevent user updating email or username to something that's not unique
  
      var createdUserId = 1;

      var updatedUser = {
        "username": "anotherusername",
        "email": "rod.dearaujo2@gmail.com",
        "password": "anotherPassword"
      }

      chai.request(server)
          .put('/users/' + createdUserId)
          .set('content-type', 'application/json')
          .send(updatedUser)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success").equal(true);
              res.body.data.username.should.equal("anotherusername");
              res.body.data.email.should.equal("rod.dearaujo2@gmail.com");
              done();
          });

    });

    it('should update fields of an actor', (done) => {
  
      var createdActorId = 1;

      var updatedActor = {
        "firstName": "rodrigao",
        "middleName": "silveta",
        "lastName": "araujo",
        "legalName": "rodrigo legalname",
        "streetAddress": "1988 stephens street",
        "suite": "403",
        "profile": "Just an actor. Still looking for jobs tho",
        "creditId": [
          3
        ],
        "unionId": [
          1
        ]
      }

      chai.request(server)
          .put('/actors/' + createdActorId)
          .set('content-type', 'application/json')
          .send(updatedActor)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.firstName.should.equal("rodrigao");
              res.body.data.middleName.should.equal("silveta");
              res.body.data.legalName.should.equal("rodrigo legalname");
              res.body.data.streetAddress.should.equal("1988 stephens street");
              res.body.data.suite.should.equal("403");
              res.body.data.creditId.should.deep.equal([3]);
              res.body.data.unionId.should.deep.equal([1]);

              // Double request with same thing.
              chai.request(server)
              .put('/actors/' + createdActorId)
              .set('content-type', 'application/json')
              .send(updatedActor)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.firstName.should.equal("rodrigao");
                  res.body.data.middleName.should.equal("silveta");
                  res.body.data.legalName.should.equal("rodrigo legalname");
                  res.body.data.streetAddress.should.equal("1988 stephens street");
                  res.body.data.suite.should.equal("403");
                  res.body.data.creditId.should.deep.equal([3]);
                  res.body.data.unionId.should.deep.equal([1]);
                  done();
              });
          });

    });


    it('should delete an actor', (done) => {

      var actorToBeDeleted = {
        "user": {
          "username": "digorithm3",
          "email": "rod.dearaujo3@gmail.com",
          "roleId": 1,
          "password": "test1234"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "legalName": "rodrigo araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "suite": "1005",
        "isRepresented": false,
        "height": 178,
        "weight": 174,
        "birthdate": moment(new Date("06-08-1993")).format('YYYY-MM-DD'),
        "profile": "Just an actor",
        "eyeId": 1,
        "hairId": 1,
        "genderId": 1,
        "ethnicityId": 1,
        "countryId": 1,
        "cityId": 1,
        "creditId": [
          1,
          2
        ],
        "unionId": [
          3,
          4
        ]
      }

      chai.request(server)
          .post('/actors')
          .send(actorToBeDeleted)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("success").equal(true)
              // Call the delete endpoint
              chai.request(server)
                .delete('/actors/' + res.body.data.id)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(204);
                  done();
                });
          });

    });
    
    it('should get all agents with empty database', (done) => {
      chai.request(server)
          .get('/agents')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(0);
            done();
          });
    });

    it('should sign up a new agent and get this agent', (done) => {

      var agent = {
        "user": {
          "username": "digoagent",
          "email": "rod.dearaujo23@gmail.com",
          "roleId": 2,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just an agent",
        "countryId": 1,
        "cityId": 1,
        "sizeOfRoster": 12,
        "website": "agent.com",
        "agencyName": "The agency name",
        "zipPostal": "XXXXXX",
        "position": "manager",
        "agencyDivisionId": [
          1,
          2
        ],
        "rosterTypeId": [
          3,
          4
        ]
      }

      var expectedResponse = {
        "user": {
          "username": "digoagent",
          "email": "rod.dearaujo23@gmail.com",
          "roleId": 2,
          "id": 4
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just an agent",
        "countryId": 1,
        "cityId": 1,
        "sizeOfRoster": 12,
        "website": "agent.com",
        "agencyName": "The agency name",
        "zipPostal": "XXXXXX",
        "position": "manager",
        "agencyDivisionId": [
          1,
          2
        ],
        "rosterTypeId": [
          3,
          4
        ],
        "id": 1,
        "userId": 4
      }

      chai.request(server)
          .post('/agents')
          .send(agent)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              
              res.body.data.should.deep.equal(expectedResponse)
              chai.request(server)
                .get('/agents/' + res.body.data.id)
                .end((err, res) => {
                    res.body.data.should.deep.equal(expectedResponse)
                    done();
              });
          });

      
    });

    it('should update fields of an agent', (done) => {
  
      var createdAgentId = 1;

      var updatedAgent = {
        "firstName": "rodrigao",
        "middleName": "silveta",
        "lastName": "araujo",
        "profile": "More than an agent!",
        "sizeOfRoster": 21,
        "website": "agent.me",
        "agencyName": "My new agency",
        "position": "CEO",
        "agencyDivisionId": [
          1
        ],
        "rosterTypeId": [
          3
        ]
      }

      chai.request(server)
          .put('/agents/' + createdAgentId)
          .set('content-type', 'application/json')
          .send(updatedAgent)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.rosterTypeId.should.deep.equal([3]);
              res.body.data.agencyDivisionId.should.deep.equal([1]);
              

              // Double request with same thing.
              chai.request(server)
              .put('/agents/' + createdAgentId)
              .set('content-type', 'application/json')
              .send(updatedAgent)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.rosterTypeId.should.deep.equal([3]);
                  res.body.data.agencyDivisionId.should.deep.equal([1]);
                  done();
              });
          });

    });

    it('should delete an actor', (done) => {

      var agentToBeDeleted = {
        "user": {
          "username": "digoagent2",
          "email": "rod.dearaujo223@gmail.com",
          "roleId": 2,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just an agent",
        "countryId": 1,
        "cityId": 1,
        "sizeOfRoster": 12,
        "website": "agent.com",
        "agencyName": "The agency name",
        "zipPostal": "XXXXXX",
        "position": "manager",
        "agencyDivisionId": [
          1,
          2
        ],
        "rosterTypeId": [
          3,
          4
        ]
      }

      chai.request(server)
          .post('/agents')
          .send(agentToBeDeleted)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("success").equal(true)
              // Call the delete endpoint
              chai.request(server)
                .delete('/agents/' + res.body.data.id)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(204);
                  done();
                });
          });

    });

  
  });

});