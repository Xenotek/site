var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/simpleDB');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/* POST add */
var UsersDB = mongoose.model('users', {
  name: String,
  surname: String
});

var jsonParser = bodyParser.json();

/*Home page*/
app.get('/', function(req, res) {
  res.render('pages/index', { title: 'Главная' });
/*
  UsersDB.find({}, function (err, items) {

    UsersDB.count({}, function (err, count) {
      console.log(count);

      res.render('index', {
        title: 'Simple MongoDB',
        data: items,
        counter: count
      });

    });


  });
  */
  //res.render('index', { title: 'Simple MongoDB' });
});

app.get('/works.html', function(req, res) {
    res.render('pages/works', { title: 'Главная' });
});

app.get('/about.html', function(req, res) {
    res.render('pages/about', { title: 'Главная' });
});
app.get('/blog.html', function(req, res) {
    res.render('pages/blog', { title: 'Главная' });
});



app.post('/addItem', jsonParser, function(req, res) {
  var usersDB = new UsersDB(req.body);

  usersDB.save(function(err) {
    if (err) {
      res.send('ошибка');
    } else {
      res.send('ok');
    }
  });
});

app.post('/delItem', jsonParser, function(req, res) {

  UsersDB.findOne({_id: req.body.id}, function (err, user) {

    user.remove(function (err) {

      console.log('User deleted!')
    })

  });

  console.log(req.body.id);

  //res.send(req.body);
  //console.log(req.body);

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
