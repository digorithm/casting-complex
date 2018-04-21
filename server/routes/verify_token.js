var jwt = require('jsonwebtoken');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.jwt_encryption, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    // This userId is actually the id being returned by
    // (actor | agent | CD post route) OR the login route
    // which is the actor | agent | CD id 
    req.userId = decoded.id;
    req.roleId = decoded.roleId;
    req.baseId = decoded.baseId;
    next();
  });
}

module.exports = verifyToken;