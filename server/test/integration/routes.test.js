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
  
  var mainActorToken = '';
  var mainAgentToken = '';
  var mainCastingDirectorToken = '';

  before((done) => {
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

    chai.request(server)
          .post('/actors')
          .send(actor)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              mainActorToken = res.body.session_token;
          });
    
    var agent = {
            "user": {
              "username": "digoagentmain",
              "email": "rod.dearaujo23main@gmail.com",
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
          .send(agent)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              mainAgentToken = res.body.session_token;
          });

      var castingDirector = {
            "user": {
              "username": "digodirectormain",
              "email": "rod.dearaujo25main@gmail.com",
              "roleId": 3,
              "password": "test123"
            },
            "firstName": "rodrigo",
            "middleName": "silva",
            "lastName": "de araujo",
            "streetAddress": "5775 toronto road",
            "phone": "7783209600",
            "mobile": "7783209600",
            "profile": "Just a casting director",
            "countryId": 1,
            "cityId": 1,
            "website": "agent.com",
            "zipPostal": "XXXXXX",
            "companyName": "The casting company",
            "position": "manager",
            "specializationId": [
              1,
              2
            ]
          }
      
      chai.request(server)
          .post('/castingdirectors')
          .send(castingDirector)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              mainCastingDirectorToken = res.body.session_token;
              done();
          });
          

  });

  after(async function () {
    await require('../../models').sequelize.sync({force: true});
  });

  beforeEach(async function () {
  });

  describe('User, Actors, Agents, and Casting Directors CRUD', function () {

    it('should get all users', (done) => {
      chai.request(server)
          .get('/users')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
            done();
          });
    });

    it('should get all actors', (done) => {
      chai.request(server)
          .get('/actors')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
            done();
          });
    });

    it('should sign up a new actor and get this actor', (done) => {

      var actor = {
        "user": {
          "username": "digorithm3333",
          "email": "rod.dearaujo3333@gmail.com",
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
          "username": "digorithm3333",
          "email": "rod.dearaujo3333@gmail.com",
          "roleId": 1,
          "id": 4
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
        "userId": 4,
        "id": 2
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
          .put('/actors')
          .set('content-type', 'application/json')
          .set('x-access-token', mainActorToken)
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
              .put('/actors')
              .set('content-type', 'application/json')
              .set('x-access-token', mainActorToken)
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
              var token = res.body.session_token;
              // Call the delete endpoint
              chai.request(server)
                .delete('/actors')
                .set('x-access-token', token)
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
          "id": 7
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
        "id": 2,
        "userId": 7
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
          .put('/agents')
          .set('content-type', 'application/json')
          .set('x-access-token', mainAgentToken)
          .send(updatedAgent)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.rosterTypeId.should.deep.equal([3]);
              res.body.data.agencyDivisionId.should.deep.equal([1]);
              
              // Double request with same thing.
              chai.request(server)
              .put('/agents')
              .set('content-type', 'application/json')
              .set('x-access-token', mainAgentToken)
              .send(updatedAgent)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.rosterTypeId.should.deep.equal([3]);
                  res.body.data.agencyDivisionId.should.deep.equal([1]);
                  done();
              });
          });

    });

    it('should delete an agent', (done) => {

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
              var token = res.body.session_token;
              // Call the delete endpoint
              chai.request(server)
                .delete('/agents')
                .set('x-access-token', token)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(204);
                  done();
                });
          });

    });

  it('should get all casting directors with empty database', (done) => {
      chai.request(server)
          .get('/castingdirectors')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a('array');
            done();
          });
    });

    it('should sign up a new casting director and get this casting director', (done) => {

      var castingDirector = {
        "user": {
          "username": "digodirector",
          "email": "rod.dearaujo25@gmail.com",
          "roleId": 3,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just a casting director",
        "countryId": 1,
        "cityId": 1,
        "website": "agent.com",
        "zipPostal": "XXXXXX",
        "companyName": "The casting company",
        "position": "manager",
        "specializationId": [
          1,
          2
        ]
      }

      var expectedResponse = {
        "user": {
          "username": "digodirector",
          "email": "rod.dearaujo25@gmail.com",
          "roleId": 3,
          "id": 9
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just a casting director",
        "countryId": 1,
        "cityId": 1,
        "website": "agent.com",
        "zipPostal": "XXXXXX",
        "position": "manager",
        "companyName": "The casting company",
        "specializationId": [
          1,
          2
        ],
        "id": 2,
        "userId": 9
      }

      chai.request(server)
          .post('/castingdirectors')
          .send(castingDirector)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              
              res.body.data.should.deep.equal(expectedResponse)
              chai.request(server)
                .get('/castingdirectors/' + res.body.data.id)
                .end((err, res) => {
                    res.body.data.should.deep.equal(expectedResponse)
                    done();
              });
          });

      
    });

    it('should update fields of a casting director', (done) => {
  
      var updatedCastingDirector = {
        "firstName": "rodrigao",
        "middleName": "silveta",
        "lastName": "araujo",
        "profile": "More than a casting director!",
        "companyName": "My newest company",
        "website": "casting.me",
        "position": "CEO",
        "specializationId": [
          4
        ]
      }

      chai.request(server)
          .put('/castingdirectors')
          .set('content-type', 'application/json')
          .set('x-access-token', mainCastingDirectorToken)
          .send(updatedCastingDirector)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.data.specializationId.should.deep.equal([4]);

              // Double request with same thing.
              chai.request(server)
              .put('/castingdirectors')
              .set('content-type', 'application/json')
              .set('x-access-token', mainCastingDirectorToken)
              .send(updatedCastingDirector)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.specializationId.should.deep.equal([4]);
                  done();
              });
          });

    });

    it('should delete a casting director', (done) => {

      var castingDirectorToBeDeleted = {
        "user": {
          "username": "digodirector2",
          "email": "rod.dearaujo27@gmail.com",
          "roleId": 3,
          "password": "test123"
        },
        "firstName": "rodrigo",
        "middleName": "silva",
        "lastName": "de araujo",
        "streetAddress": "5775 toronto road",
        "phone": "7783209600",
        "mobile": "7783209600",
        "profile": "Just a casting director",
        "countryId": 1,
        "cityId": 1,
        "website": "agent.com",
        "zipPostal": "XXXXXX",
        "companyName": "The casting company",
        "position": "manager",
        "specializationId": [
          1,
          2
        ]
      }

      chai.request(server)
          .post('/castingdirectors')
          .send(castingDirectorToBeDeleted)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("success").equal(true)
              var token = res.body.session_token
              // Call the delete endpoint
              chai.request(server)
                .delete('/castingdirectors')
                .set('x-access-token', token)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(204);
                  done();
                });
          });

    });
  
    it('should get no agents from a unrepp actor', (done) => {

      var actor = {
        "user": {
          "username": "digorithm10",
          "email": "rod.dearauj2@gmail.com",
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
          .send(actor)
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("success").equal(true)
              // Call the delete endpoint
              chai.request(server)
                .get('/actors/' + res.body.data.id + '/agents')
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(200);
                    secondRes.body.data.length.should.be.eql(0);
                  done();
                });
          });

    });

    it('should be able for an agent to represent an actor', (done) => {

      var actorToBeAdded = { actorId: 1 };
      
      chai.request(server)
                .post('/agents/actors')
                .set('x-access-token', mainAgentToken)
                .send(actorToBeAdded)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(200);
                    secondRes.body.message.should.equal("Actor added to agent");
                    secondRes.body.success.should.equal(true);
                    chai.request(server)
                      .get('/agents/1/actors')
                      .set('x-access-token', mainAgentToken)
                      .end((thirdErr, thirdRes) => {
                          thirdRes.should.have.status(200);
                          thirdRes.body.data.length.should.be.eql(1);
                          thirdRes.body.success.should.equal(true);
                        done();
                      });
                });
    });

    it('should be able for an agent to remove an actor', (done) => {

      var actorToBeRemoved = { actorId: 1 };

      chai.request(server)
        .delete('/agents/actors')
        .set('x-access-token', mainAgentToken)
        .send(actorToBeRemoved)
        .end((secondErr, secondRes) => {
            secondRes.should.have.status(200);
            secondRes.body.message.should.equal("Actor removed from agent");
            secondRes.body.success.should.equal(true);
            chai.request(server)
              .get('/agents/1/actors')
              .end((thirdErr, thirdRes) => {
                  thirdRes.should.have.status(200);
                  thirdRes.body.data.length.should.be.eql(0);
                  thirdRes.body.success.should.equal(true);
                done();
              });
        });

    });

    it('should be able for an actor to remove an agent', (done) => {

      var actorToBeAdded = { actorId: 1 };
      var agentToBeRemoved = { agentId: 1 };

      chai.request(server)
                .post('/agents/actors')
                .set('x-access-token', mainAgentToken)
                .send(actorToBeAdded)
                .end((secondErr, secondRes) => {
                    secondRes.should.have.status(200);
                    secondRes.body.message.should.equal("Actor added to agent");
                    secondRes.body.success.should.equal(true);
                    chai.request(server)
                            .delete('/actors/agents')
                            .set('x-access-token', mainActorToken)
                            .send(agentToBeRemoved)
                            .end((secondErr, secondRes) => {
                                secondRes.should.have.status(200);
                                secondRes.body.message.should.equal("Agent removed from actor");
                                secondRes.body.success.should.equal(true);
                                chai.request(server)
                                  .get('/actors/1/agents')
                                  .end((thirdErr, thirdRes) => {
                                      thirdRes.should.have.status(200);
                                      thirdRes.body.data.length.should.be.eql(0);
                                      thirdRes.body.success.should.equal(true);
                                    done();
                                  });
                            });
                    
                });
    });

    it('should send a message from one user to another', (done) => {
      var userCreatorId = 1;
      var userRecipientId = 2;
      var messageObject = {
        subject: "This is the title of this message",
        messageBody: "Here's the content",
        recipients: [userRecipientId]
      }
      
      // Test sending the message
      chai.request(server)
        .post('/users/messages')
        .set('x-access-token', mainActorToken)
        .send(messageObject)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.message.should.equal("Message sent");
            // Test reading from inbox
            chai.request(server)
              .get('/users/messages/inbox')
              .set('x-access-token', mainAgentToken)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.length.should.be.eql(1);
                  res.body.data[0].messageBody.should.equal("Here's the content");
                  res.body.data[0].subject.should.equal("This is the title of this message");
                  res.body.data[0].creatorId.should.equal(userCreatorId);
                  // Test reading sent box
                  chai.request(server)
                    .get('/users/messages/sent')
                    .set('x-access-token', mainActorToken)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.length.should.be.eql(1);
                        res.body.data[0].messageBody.should.equal("Here's the content");
                        res.body.data[0].subject.should.equal("This is the title of this message");
                        res.body.data[0].creatorId.should.equal(userCreatorId);
                      done();
                    });
              });
        });

    });

    it('should get all inbox messages from a user', (done) => {
      var userId = 1;

      chai.request(server)
        .get('/users/messages/inbox')
        .set('x-access-token', mainActorToken)
        .end((err, res) => {
            res.should.have.status(200);
          done();
        });

    });
    
    it('should allow casting director to submit a breakdown', (done) => {
      var castingDirectorId = 1;
      var breakdown = {
        name: "The nicest tv show",
        requiresUnion: true,
        rates: "$500 per hour",
        contact: "send an email to test@gmail.com with the subject TVSHOW",
        citiesForTransmission: "Vancouver, Toronto, Quebec",
        synopsis: "The synopsis for this tv show",
        storyline: "The storyline for this tv show",
        comments: "Some long comment about this project",
        shootingStartsWhen: moment(new Date("06-08-2018")).format('YYYY-MM-DD'),
        shootingEndsWhen: moment(new Date("06-24-2018")).format('YYYY-MM-DD'),
        submissionDeadline: moment(new Date("06-01-2018")).format('YYYY-MM-DD'),
        callbackDate: moment(new Date("06-03-2018")).format('YYYY-MM-DD'),
        castingDirectorId: castingDirectorId,
        mediaTypeId: 1
      };

      chai.request(server)
        .post('/breakdowns')
        .set('x-access-token', mainCastingDirectorToken)
        .send(breakdown)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.data.name.should.equal("The nicest tv show");
            res.body.data.requiresUnion.should.equal(true);
            res.body.data.rates.should.equal("$500 per hour");
            res.body.data.contact.should.equal("send an email to test@gmail.com with the subject TVSHOW");
            res.body.data.citiesForTransmission.should.equal("Vancouver, Toronto, Quebec");
            res.body.data.synopsis.should.equal("The synopsis for this tv show");
            res.body.data.storyline.should.equal("The storyline for this tv show");
            res.body.data.comments.should.equal("Some long comment about this project");
            res.body.data.shootingStartsWhen.should.equal("2018-06-08");
            res.body.data.shootingEndsWhen.should.equal("2018-06-24");
            res.body.data.CastingDirectorId.should.equal(1);            res.body.data.mediaTypeId.should.equal(1);

          done();
        });

    });

    it('should get all breakdowns', (done) => {

      chai.request(server)
        .get('/breakdowns/')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.length.should.equal(1)
          done();
        });

    });

    it('should get previously created breakdown by id', (done) => {
      var breakdownId = 1;

      chai.request(server)
        .get('/breakdowns/' + breakdownId)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.name.should.equal("The nicest tv show");
            res.body.data.requiresUnion.should.equal(true);
            res.body.data.rates.should.equal("$500 per hour");
            res.body.data.contact.should.equal("send an email to test@gmail.com with the subject TVSHOW");
            res.body.data.citiesForTransmission.should.equal("Vancouver, Toronto, Quebec");
            res.body.data.synopsis.should.equal("The synopsis for this tv show");
            res.body.data.storyline.should.equal("The storyline for this tv show");
            res.body.data.comments.should.equal("Some long comment about this project");
            res.body.data.shootingStartsWhen.should.equal("2018-06-08");
            res.body.data.shootingEndsWhen.should.equal("2018-06-24");
            res.body.data.CastingDirectorId.should.equal(1);            res.body.data.mediaTypeId.should.equal(1);
            
          done();
        });

    });

    it('should update previously created breakdown by id', (done) => {
      var breakdownId = 1;

      var updatedBreakdown = {
        name: "The most awesome tv show",
        requiresUnion: false,
        rates: "$700 per hour",
        citiesForTransmission: "Vancouver, Toronto",
        comments: "Quebec is out",
        shootingStartsWhen: moment(new Date("06-01-2018")).format('YYYY-MM-DD'),
        shootingEndsWhen: moment(new Date("07-24-2018")).format('YYYY-MM-DD')
      };

      chai.request(server)
        .put('/breakdowns/' + breakdownId)
        .set('x-access-token', mainCastingDirectorToken)
        .send(updatedBreakdown)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.name.should.equal("The most awesome tv show");
            res.body.data.requiresUnion.should.equal(false);
            res.body.data.rates.should.equal("$700 per hour");
            res.body.data.citiesForTransmission.should.equal("Vancouver, Toronto");
            res.body.data.comments.should.equal("Quebec is out");
            res.body.data.shootingStartsWhen.should.equal("2018-06-01");
            res.body.data.shootingEndsWhen.should.equal("2018-07-24");
          done();
        });

    });

    it('Should add 2 roles to previously created breakdown', (done) => {
      var breakdownId = 1;

      var role1 = {
          ageRange: "15 to 24",
          description: "description of the role",
      };

      var role2 = {
        ageRange: "25 to 34",
        description: "description of the second role",
    };

      chai.request(server)
        .post('/breakdowns/' + breakdownId + "/roles")
        .send(role1)
        .set('x-access-token', mainCastingDirectorToken)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.data.id.should.equal(1);
            res.body.data.ageRange.should.equal("15 to 24");
            res.body.data.description.should.equal("description of the role");
            chai.request(server)
            .post('/breakdowns/' + breakdownId + "/roles")
            .set('x-access-token', mainCastingDirectorToken)
            .send(role2)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.data.id.should.equal(2);
                res.body.data.ageRange.should.equal("25 to 34");
                res.body.data.description.should.equal("description of the second role");
              done();
            });
        });

    });

    it('Should get roles from previously created breakdown', (done) => {
      var breakdownId = 1;

      chai.request(server)
        .get('/breakdowns/' + breakdownId + "/roles")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.length.should.be.eql(2);
            res.body.data[0].ageRange.should.equal("15 to 24");
            res.body.data[0].description.should.equal("description of the role");
            res.body.data[1].ageRange.should.equal("25 to 34");
            res.body.data[1].description.should.equal("description of the second role");
            done();
        });

    });

    it('Should get first role from previously created breakdown', (done) => {
      var breakdownId = 1;

      var roleId = 1;

      chai.request(server)
        .get('/breakdowns/' + breakdownId + "/roles/" + roleId)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.id.should.equal(1);
            res.body.data.ageRange.should.equal("15 to 24");
            res.body.data.description.should.equal("description of the role");
            done();
        });

    });
    
    it('Should update first role from previously created breakdown', (done) => {
      var breakdownId = 1;

      var roleId = 1;

      var updatedRole =  {
        description: "new description",
        ageRange: "12 to 15"
      }

      chai.request(server)
        .put('/breakdowns/' + breakdownId + "/roles/" + roleId)
        .set('x-access-token', mainCastingDirectorToken)
        .send(updatedRole)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.id.should.equal(1);
            res.body.data.ageRange.should.equal("12 to 15");
            res.body.data.description.should.equal("new description");
            done();
        });

    });

    it('Should delete second role from previously created breakdown', (done) => {
      var breakdownId = 1;

      var roleId = 2;

      chai.request(server)
        .delete('/breakdowns/' + breakdownId + "/roles/" + roleId)
        .set('x-access-token', mainCastingDirectorToken)
        .end((err, res) => {
            res.should.have.status(200);
            chai.request(server)
              .get('/breakdowns/' + breakdownId + "/roles")
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data.length.should.be.eql(1)
                  done();
              });
        });

    });

    it('Should allow an actor to send an audition request for a breakdown', (done) => {
      var breakdownId = 1;
      var actorId = 1
      var roleId = 1;

      var auditionRequest = {
        comments: "Please consider me",
        ActorId: actorId
      }

      chai.request(server)
        .post('/breakdowns/' + breakdownId + "/roles/" + roleId + "/requests")
        .set('x-access-token', mainActorToken)
        .send(auditionRequest)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.message.should.equal("Request sent");
            done();
        });

    });

    it('Should get audition requests from a breakdown', (done) => {
      var breakdownId = 1;
      var roleId = 1;

      chai.request(server)
        .get('/breakdowns/' + breakdownId + "/roles/" + roleId + "/requests")
        .set('x-access-token', mainCastingDirectorToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.length.should.be.eql(1);
            res.body.data[0].comments.should.equal("Please consider me");
            res.body.data[0].ActorId.should.equal(1);
            res.body.data[0].statusId.should.equal(1);
            done();
        });

    });

    it('Should approve audition requests breakdown', (done) => {
      var breakdownId = 1;
      var roleId = 1;
      var requestId = 1;

      var answer = {accepts: true}

      chai.request(server)
        .post('/breakdowns/' + breakdownId + "/roles/" + roleId + "/requests/" + requestId + "/answer")
        .set('x-access-token', mainCastingDirectorToken)
        .send(answer)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.message.should.equal("Request approved");
            // Check if the actor received notification
            chai.request(server)
              .get('/users/messages/inbox')
              .set('x-access-token', mainActorToken)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data[0].messageBody.should.equal("Your audition request for the project The most awesome tv show has been accepted.")
                  done();
              });
        });

    });

    it('Should schedule an audition for a previously accepted request', (done) => {
      var breakdownId = 1;
      var roleId = 1;
      var auditionRequestId = 1;

      var audition = {
        address: "Address of the audition",
        comments: "Some comments",
        startsWhen: new Date("May 20, 2018 09:30:00"),
        endsWhen: new Date("May 20, 2018 11:30:00"),
        auditionRequestId: auditionRequestId
      }

      chai.request(server)
        .post('/breakdowns/' + breakdownId + "/auditions")
        .set('x-access-token', mainCastingDirectorToken)
        .send(audition)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.data.address.should.equal("Address of the audition");
            res.body.data.comments.should.equal("Some comments");
            res.body.data.startsWhen.should.equal("May 20th 2018, 9:30:00 am");
            res.body.data.endsWhen.should.equal("May 20th 2018, 11:30:00 am");
            // Check if the actor received notification
            chai.request(server)
              .get('/users/messages/inbox')
              .set('x-access-token', mainActorToken)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.data[1].messageBody.should.equal("Your audition for the project The most awesome tv show has been scheduled for May 20th 2018, 9:30:00 am to May 20th 2018, 11:30:00 am at Address of the audition")
                  done();
              });
        });

    });

    it('Should get auditions from a breakdown', (done) => {
      var breakdownId = 1;

      chai.request(server)
        .get('/breakdowns/' + breakdownId + "/auditions")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.length.should.be.eql(1);
            done();
        });
    });

    it('Should update previously created audition from a breakdown', (done) => {
      var breakdownId = 1;
      var auditionId = 1;

      var updatedAudition = {
        address: "New address",
        comments: "Address and time were changed",
        startsWhen: new Date("May 20, 2018 08:30:00"),
        endsWhen: new Date("May 20, 2018 10:30:00"),
      }

      chai.request(server)
        .put('/breakdowns/' + breakdownId + "/auditions/" + auditionId)
        .set('x-access-token', mainCastingDirectorToken)
        .send(updatedAudition)
        .end((err, res) => {
            res.should.have.status(200);
            chai.request(server)
            .get('/breakdowns/' + breakdownId + "/auditions/" + auditionId)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.address.should.equal("New address");
                res.body.data.comments.should.equal("Address and time were changed");
                res.body.data.startsWhen.should.equal("May 20th 2018, 8:30:00 am");
                res.body.data.endsWhen.should.equal("May 20th 2018, 10:30:00 am");
                done();
            });
        });

    });

    it('Should get all extra resources', (done) => {

      chai.request(server)
        .get('/extras')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('Should get all cities of a country', (done) => {

      chai.request(server)
        .get('/extras/cities/28')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('Should login as an actor', (done) => {

      var actor = {
        "user": {
          "username": "digorithmAnother",
          "email": "rod.dearaujoAnother@gmail.com",
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

      var loginRequest = {
        username: "digorithmAnother",
        password: "test123"
      };

      chai.request(server)
          .post('/actors')
          .send(actor)
          .end((err, res) => {
              
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property('data');
              
              chai.request(server)
              .post('/login')
              .send(loginRequest)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.auth.should.equal(true);
                  done();
              });              
          });

      

    });
  
  });

});