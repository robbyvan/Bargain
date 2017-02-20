var mongoose = require('mongoose');

//AdminItem Schema
var adminItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offer: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vendor: {
    type: String,
    required: true
  },
  img_url: {
    type: String
  },
  create_date:{
    type: Date,
    default: Date.now
  }
});

var AdminItem = mongoose.model('AdminItem', adminItemSchema);
module.exports = AdminItem;

//Selling page

//READ: get [limit] items
module.exports.getAdminItems = function (callback, limit){
  AdminItem.find(callback).limit(limit);
};

//READ: get more info about the AdminItem
module.exports.getAdminItemById = function(id, callback){
  AdminItem.findById(id, callback);
};

//CREATE: add a new admin item
module.exports.addAdminItem = function(newItem, callback){
  AdminItem.create(newItem, callback);
}

//DELETE: remove the request from AdminItem
module.exports.removeAdminItem = function(id, callback){
  var query = {_id: id};
  AdminItem.remove(query, callback);
}

//PUT: (need authentication first) edit AdminItem info
// module.exports.updateAdminItem = function(id, AdminItem, options, callback){
//   var query = {_id: id};
//   var update = {
//     price: AdminItem.price,
//     offer: AdminItem.offer,
//     description: AdminItem.description,
//     img_url: AdminItem.img_url,
//     create_date: Date.now
//   };
//   AdminItem.findOneAndUpdate(query, update, options, callback);
// };


