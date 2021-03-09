let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

//BD
let mysql = require("mysql");
const { resolveSoa } = require('dns');

// dotenv
require('dotenv').config()

// dotenv process.env 
const {host, user, password, database} = process.env
const con = mysql.createConnection({
  host,
  user,
  password,
  database,
});


con.connect((err)=>{
  if(err){
    console.log('connecting error! reason:',err);
    return;
  }
  console.log('connecting success!');
});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db state
app.use((req, res, next)=>{
  req.con = con;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  var err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// error handler

// development error handler
// will print stacktrace
if(app.get('env') === 'development'){
  app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.render('error',{
      message:err.message,
      error:err
    });
  });
}

// productiion error handler
// no stacktraces leaker to user

app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('error',{
    message: err.message,
    error:{}
  });
});
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
