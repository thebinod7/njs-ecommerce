const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const mongoose = require('mongoose');

const product = require('./routes/product');
const user = require('./routes/user');

const app = express();

const port = 4242;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('layout extractScripts', true);

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// ROUTES FOR OUR API
app.use('/', require('./routes'));
app.use('/product', product);
app.use('/user', user);


app.use(cors());
app.use(express.static(path.join(__dirname,'public')));


//Start server
app.listen(port,function () {
    console.log('Server running at port:' + port);
});
