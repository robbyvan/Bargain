var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users.js');
var AdminItem = require('../models/admin_items.js');
var Item = require('../models/items.js');
var Cart = require('../models/cart.js');


//check if authenticated.
function ensureAuthenticated(req, res, next){
  console.log('*************************************');
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()){
    return next();
  }else{
    // req.flash('error', 'You are not logged in');
    res.json({authenticated: false, username: undefined});
  }
}

//GET: check auth
router.get('/ensureAuth', ensureAuthenticated, function(req, res){
  console.log('=====USER=====');
  console.log(req.session.passport.user);
  User.getUserById(req.session.passport.user, function(err, user){
    console.log('-----After-----');
    console.log(user);
    res.json({authenticated: true, username: user.username});
  });
});


//GET: get all users
router.get('/users', function(req, res){
  User.getUsers(function(err, users){
    if(err) throw err;
    res.json(users);
  });
});

        /*---Registration Begin---*/

//POST: create an account.
router.post('/register', function(req, res){
  console.log(req.body);
  
  //Validations (Validations could be done at client side)
  req.checkBody('username', 'Username is required.').notEmpty();
  //Notice: need to check if username already existed later
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Password does not match.').equals(req.body.password);
  //No need to check e-mail format at server side.

  var errors = req.getValidationResult()
  .then(function(result){
    if (!result.isEmpty()){
      var errors = result.array();
      console.log('hey! sth wrong!' + errors);
      // var obj = Object.assign(res, errors);
      res.json(errors);
    }else{
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        group: 2, // 1 - admin; 2 - ordinary user
        selling: []
      });
      console.log(newUser);
      User.createUser(newUser, function(err, user){
        if (err){
          res.json({created: false});
          throw err;
        }
        console.log('info correct!' + user);
        res.json({created: true});

        //also create cart for the user
        var newUserCart = new Cart({
          user_id: user._id,
          orders: []
        });
        Cart.createCart(newUserCart, function(err, cart){
          if (err) throw err;
          console.log('cart created.');
          console.log(cart);
        });

      });
    }
  });       
});

        /*----Registration End---*/     



        /*---Login Begin---*/
//set strategy
passport.use(new LocalStrategy(
  function (username, password, done){
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if (!user){
        return done(null, false, {message: 'Unknow Username'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if (isMatch){
          console.log('Valid user. He is: ' + user);
          return done(null, user);
        }else{
          return done(null, false, {message: 'Incorrect Password'});
        }
      });
      
    });
  }
));

//POST: login request
router.post('/login', 
  passport.authenticate('local'), 
  function(req, res){
    //if authentication passed.
    req.login(req.user, function(err) {
      if (err) {return next(err);}
      console.log("Request Login supossedly successful.");
      // return res.send('Login successful');
    });
    console.log('passed, req is: ');
    res.json({logged: true});
  }
);

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/'); }
//     req.login(user, function(err) {
//       if (err) { return next(err); }
//       console.log('passed, req is: ');
//       res.json({logged: true});
//     });
//   })(req, res, next);
// });


//Serialize & Deserialize
passport.serializeUser(function(user, done) {
  console.log('Serialize, user is: ' + user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    console.log('deSerialize, user is: ' + user);
    done(err, user);
  });
});
        /*---Login End---*/




        /*---Logout Begin---*/
router.get('/logout', function(req, res){
  req.logout();
  res.send('done');
});
        /*---Logout End---*/




        /*Admin Item Begin*/

//GET
router.get('/admin_items', function(req, res){
  AdminItem.getAdminItems(function(err, items){
    if(err) throw err;
    res.json(items);
  });
});

//GET
router.get('/admin_items/:_id', function(req, res){
  var id = req.params._id;
  AdminItem.getAdminItemById(id, function(err, item){
    if (err) throw err;
    res.json(item);
  });
});

//POST
router.post('/admin_items', function(req, res){
  var newAdminItem = req.body;
  console.log(newAdminItem);
  AdminItem.addAdminItem(newAdminItem, function(err, items){
    if (err) throw err;
    console.log('added.');
    res.json(items);
  });
});

//DELETE
router.delete('/admin_items/:_id', function(req, res){
  var id = req.params._id;
  AdminItem.removeAdminItem(id, function(err, items){
    if (err) throw err;
    res.json(items);
  });
});
        /*Admin Item End*/




        /*Item Begin*/

//GET: get all items
router.get('/items', function(req, res){
  Item.getItems(function(err, items){
    if (err) throw err;
    res.json(items);
  });
});

//GET: get item by id
router.get('/item/:_id', function(req, res){
  var id = req.params._id;
  Item.getItemById(id, function(err, item){
    if (err) throw err;
    console.log('get item');
    res.json(item);
  });
});

//POST: add new item
router.post('/items', function(req, res){
  var newItem = req.body;
  console.log(newItem);
  Item.addItem(newItem, function(err, items){
    if (err) throw err;
    console.log('added.');
    res.json(items);
  });
});

//PUT: edit item
router.put('/items/:_id', function(req, res){
  var id = req.params._id;
  var item = req.body;
  Item.updateItem(id, item, {}, function(err, item){
    if (err) throw err;
    res.json(item);
  });
});

//DELETE: remove an item
router.delete('/items/:_id', function(req, res){
  var id = req.params._id;
  Item.removeItem(id, function(err, items){
    if (err) throw err;
    res.json(items);
  });
});

        /*Item End*/



        /*Cart Begin*/

//GET: get buy list by user's id
router.get('/cart', function(req, res){
  //需要检查身份
  var userId = req.session.passport.user;
  console.log('here');
  Cart.getBuyList(userId, function(err, buyList){
    if (err) throw err;
    console.log(buyList);
    res.json(buyList);
  });
});

//POST: add a new item to the cart
router.post('/cart/add', function(req, res){

  console.log(req.session.passport.user);

  var userId = req.session.passport.user;
  var buy = req.body;

  Cart.addToCart(userId, buy, function(err, buyList){
    if (err) throw err;
    console.log(buyList);
    res.json(buyList);
  });
});

//REMOVE: remove an item from the cart
router.put('/cart/remove', function(req, res){
  var userId = req.session.passport.user;
  var itemId = req.body.itemId;
  console.log('**********');
  console.log(itemId);

  Cart.removeFromCart(userId, itemId, function(err, buyList){
    if (err) throw err;
    console.log(buyList);
    res.json(buyList);
  });
});

        /*Cart End*/


module.exports = router;   