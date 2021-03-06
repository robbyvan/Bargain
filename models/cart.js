var mongoose = require('mongoose');

//Cart Schema
var cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orders: [{
    item_id:{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    demand: {
      type: Number
    }
  }]
});

var Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;


//CREATE: called when when an user first sign up.
module.exports.createCart = function(userCart, callback){
  userCart.save(callback);
}

//READ: get user's cart
module.exports.getBuyList = function(userId, callback){
  var query = {user_id: userId};
  Cart.find(query) //do not return userid
      // .populate('user_id', '_id username') //do not return password and email
      .populate('orders.item_id', 'name price offer vendor')
      .exec(callback);
}

//UPDATE: add a new item to the cart
module.exports.addToCart = function(userId, item, callback){
  var query = {user_id: userId};
  var update = {
    $push: {
      "orders": {
        item_id: item.itemId, 
        demand: item.demand
      }
    }
  };
  var options = {new: true};
  Cart.findOneAndUpdate(query, update, options, callback);
}

//UPDATE: edit the quantity of the order
module.exports.updateDemand = function(userId, item, callback){
  var query = {user_id: userId, "orders.item_id": item.id};
  var update = {
    orders:{
      demand: item.demand 
    }
  };
  var options = {new: true};
  Cart.findOneAndUpdate(query, update, options, callback);
}

//REMOVE: remove an item from the cart
module.exports.removeFromCart = function(userId, itemId, callback){
  var query = {user_id: userId}
  var update = {
    $pull: {
      "orders": {
        item_id: itemId
      }
    }
  };
  var options = {new: true};
  Cart.findOneAndUpdate(query, update, options, callback);
}
