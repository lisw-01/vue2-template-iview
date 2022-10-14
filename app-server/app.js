
require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const helmet = require('helmet');
const cors = require("cors");
const index = require('./routes/index');
const system = require('./routes/system');


const app = express();
// 跨域
app.use(cors());
const session_secret = Math.random().toString(36).substring(2,12);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(helmet());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: session_secret
}));
app.use(expressValidator());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap/fonts')));
// app.use('/bscss', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// app.use('/jqjs', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
// app.use('/bsjs', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use('/token', index);  //登入相关
app.use('/sys', system);  //系统相关

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
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
