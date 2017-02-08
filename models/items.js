var mongoose = require('mongoose');

//Item Schema
var itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
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

var Item = mongoose.model('Item', itemSchema);
module.exports = Item;

//Selling page

//GET: get [limit] items
module.exports.getItems = function (callback, limit){
  Item.find(callback).limit(limit);
};

//Get: get more info about the item
module.exports.getItemById = function(id, callback){
  Item.findById(id, callback);
};

//POST: (need authentication first) put new item on the shelf
module.exports.addItem = function(item, callback){
  Item.create(item, callback);
};

//PUT: (need authentication first) edit item info
module.exports.updateItem = function(id, item, options, callback){
  var query = {_id: id};
  var update = {
    price: item.price,
    quantity: item.quantity,
    description: item.description,
    img_url: item.img_url,
    // vendor: can not modify this
    // name: can not modify
    create_date: Date.now
  };
  Item.findOneAndUpdate(query, update, options, callback);
};

//DELETE: (need authentication first) remove the item
module.exports.removeItem = function(id, callback){
  var query = {_id: id};
  Item.remove(query, callback);
}
