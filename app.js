/**
Favor de NO modificar nada de esta clase, es la clase principal del servidor
*/
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./server/routes/routes');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
require('./server/passport/passport.min')(passport);

var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'pimp',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('../'+__dirname, 'public')));
app.use(require('express-pdf'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).render('404_error', null);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
