var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var adminSchema = new mongoose.Schema({
  adminName:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  group: {
    type: Number,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  selling:{
    type: Array,
  }
});

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;


//get all Admins
// module.exports.getAdmins = function(callback, limit){
//   Admin.find(callback).limit(limit);
// }

/*Register*/
//create an account
module.exports.createAdmin = function(newAdmin, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
        newAdmin.password = hash;
        newAdmin.save(callback);
    });
  });
};

/*Login*/

//READ: find Admin by Id
module.exports.getAdminById = function(id, callback){
  Admin.findById(id, callback);
}

//READ: find admin by adminName
module.exports.getAdminByAdminName = function(AdminName, callback){
  var query = {adminName: AdminName};
  Admin.findOne(query, callback);
}

//compare password
module.exports.comparePassword = function(candidatePass, hash, callback){
  bcrypt.compare(candidatePass, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
}