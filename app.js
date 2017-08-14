var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var val = require('./routes/validate');
var graphs = require('./routes/graphs');
var mychart = require('./routes/mychart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  if (! app.db) {
    const mysql = require('mysql2/promise');
    app.db = await mysql.createPool({
      connectionLimit: 50,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'plotify' });
  }
  req.db = app.db;
  return next();
});

app.use('/', index);
app.use('/users', users);
app.use('/validate', val);
app.use('/graphs',graphs);
app.use('/mychart', mychart)

//app.listen(3000);                                             //Need to remove later. Only for debugging purpose, so I can run program from node app.js command

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
