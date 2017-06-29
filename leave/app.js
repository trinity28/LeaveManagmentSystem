var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose=require('mongoose');
var methodOverride = require('method-override')
//app.use(express.static(__dirname+'/client'));




var Leave=require('./models/leave')
//var Book=require('./models/book')



mongoose.connect('mongodb://localhost/ndew');
var db=mongoose.connection;

var routes = require('./routes/index');
//var leaves = require('./routes/leave');
var users = require('./routes/user');
var app = express();

app.use(methodOverride('_method'))
app.use( bodyParser.json() );    
   // to support JSON-encoded bodies
var urlencodedParser=bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
});  

app.use( bodyParser.json() );    
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.methodOverride())
//app.use(require('express-method-override')
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/',routes);
app.use('/users', users);





app.listen(3000,function(){
	console.log('server runing on 3000 port')
})