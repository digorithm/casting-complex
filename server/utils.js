

module.exports = {
  ReE: function(res, err, code){ // Error Web Response
    if(typeof err == 'object' && typeof err.message != 'undefined'){
        err.message = err.message;
        err.error = err.error;
    }
    if(typeof code !== 'undefined') res.statusCode = code;
    return res.json({success:false, error: err});
  },

  ReS: function(res, data, code){ // Success Web Response
    let send_data = {success:true};
    if(typeof data == 'object'){
        send_data = Object.assign(data, send_data);//merge the objects
    }
    if(typeof code !== 'undefined') res.statusCode = code;
    return res.json(send_data)
  },

  ErrorMessage: {
    UserNotFound:{ message: "User not found" },
    UniqueConstrainError: function (fields) {return fields + " must be unique!"},
    UnknownError: function(err) {
      return {
        message: "Something must have gone wrong, sorry! :(",
        error: err
      }
    }
  },

  HandleSequelizeError : function(res, err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return module.exports.ReE(res, module.exports.ErrorMessage.UniqueConstrainError(Object.keys(err.fields)), 400)
    } else {
      return module.exports.ReE(res, module.exports.ErrorMessage.UnknownError(err), 500)
    }
  },

  RemoveFields: function(obj, fields) {
    fields.forEach(f => delete obj[f]);
  }
}