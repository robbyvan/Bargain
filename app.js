//Required modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
// var passport = require('passport');
// var localStrategy = require('passport-local'), Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');

//Database connect
mongoose.connect('mongodb://localhost/O2O');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('Connected to db: O2O');
});

//Init app
var app = express();

//Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, '/public')));

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitializaed: true,
  resave: true
}));

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


var User = require('./models/users.js');

//rest APIs
app.get('/', function(req, res){
  res.send('hello world!');
});

//GET all users
app.get('/api/users', function(req, res){
  User.getUsers(function(err, users){
    if(err) throw err;
    res.json(users);
  });
});

//
app.post('/api/register', function(req, res){
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

//Set port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log('Server started on port ' + app.get('port') + '...');
});