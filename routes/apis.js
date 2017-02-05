var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users.js');

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
  //Validation
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
      cart: [],
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
    console.log('passed, req is: ');
    res.json({logged: true});
  }
);

//Serialize
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

module.exports = router;   