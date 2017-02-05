var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  cart:{
    type: Array,
  },
  selling:{
    type: Array,
  }
});

var User = mongoose.model('User', userSchema);
module.exports = User;


//get all users
module.exports.getUsers = function(callback, limit){
  User.find(callback).limit(limit);
}

/*Register*/
//create an account
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
};

/*Login*/
//find user
module.exports.getUserByUsername = function(username, callback){
  console.log('Im here');
  var query = {username: username};
  User.findOne(query, callback);
}

//compare password
module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
}