const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ecommerce');

const product = require('./routes/product');
const users = require('./routes/users');
const category = require('./routes/category');

const app = express();

const port = 4321;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('layout extractScripts', true);


app.use(session({secret: 'helloworld12345678', resave:false, saveUninitialized:false, cookie: { maxAge: 6000000 }}));
app.use(flash());

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.loggedIn = req.session.loggedIn;
  next();
});

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// ROUTES FOR OUR API
app.use('/', require('./routes'));
app.use('/product', product);
app.use('/users', users);
app.use('/category', category);


app.use(cors());
app.use(express.static(path.join(__dirname,'public')));


//Start server
app.listen(port,function () {
    console.log('Server running at port:' + port);
});
