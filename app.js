//Required modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');

var apis = require('./routes/apis');

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
  cookie: {maxAge: 30000}, //expires after 30s
  saveUninitialized: true,
  resave: false
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

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


//Add routes

app.use('/api', apis);

app.get('*', function(req, res){
  res.send('404 Not found');
});
     
//Set port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log('Server started on port ' + app.get('port') + '...');
});
