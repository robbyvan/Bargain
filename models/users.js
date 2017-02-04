var mongoose = require('mongoose');

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
module.exports.createUser = function(user, callback){
  User.create(user, callback);
};