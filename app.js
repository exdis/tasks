
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var log = require('./server/log')(module);
var config  = require('./server/config');
var routes = require('./routes');
var TaskModel = require('./server/mongoose').TaskModel;
var User = require('./server/mongoose').User;
var api = require('./routes/api');
var passport = require('passport');
var flash = require('connect-flash');
var http = require('http');
var path = require('path');

var moment = require('moment');

var nodeExcel = require('excel-export');

var app = express();

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || '3000');
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({ secret: 'exidsmerules' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(req, res, next) {
  res.status(404);
  log.debug('Not found URL: %s', req.url);
  res.send({ error: 'Not found' });
  return;
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  log.error('Internal error(%d): %s', res.statusCode, err.message);
  res.send({ error: err.message });
  return;
});

app.get('/', isLoggedIn, routes.index);
app.get('/login', function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ 'email' :  email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err) {
      return done(err);
    }

    // if no user is found, return the message
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    }

    // if the user is found but the password is wrong
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage',
      'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    }

    // all is well, return successful user
    return done(null, user);
  });

}));

passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {

  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(function() {

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  email }, function(err, user) {
    // if there are any errors, return the error
      if (err) {
        return done(err);
      }

    // check to see if theres already a user with that email
      if (user) {
        return done(null, false, req.flash('loginMessage',
        'That email is already taken.'));
      } else {

        // if there is no user with that email
        // create the user
        var newUser            = new User();

        // set the user's local credentials
        newUser.email    = email;
        newUser.password = newUser.generateHash(password);

        // save the user
        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      }

    });

  });

}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/', // redirect to the admin page
  failureRedirect : '/login'
}));

app.post('/register', passport.authenticate('local-signup', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/login#register', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

app.get('/admin', isLoggedIn, function(req, res) {
  res.render('index');
});

app.get('/admin/*', isLoggedIn, function(req, res) {
  res.render('index');
});

app.get('/view/*', function(req, res) {
  res.render('index');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/api', function(req, res) {
  res.send('API is running');
});

app.get('/api/tasks/:id/:page', function(req, res) {
  var count;
  TaskModel.count({userid : req.params.id}, function(err, c) {
    if (!err) {
      count = c;
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      return res.send({ error: 'Server error' });
    }
  });
  return TaskModel.find({userid : req.params.id}, null,
  {skip: (req.params.page - 1) * 20, sort :
  {pubDate : -1}, limit : 20}, function (err, tasks) {
    if (!err) {
      var out = {
        count : count,
        tasks : tasks
      }
      return res.send(out);
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      return res.send({ error: 'Server error' });
    }
  });
});

app.get('/api/tasks/date/:id/:year/:month', function(req, res) {
  var year = req.params.year;
  var month = req.params.month;
  var minmonth = year + ' ' + parseInt(month);
  var maxmonth = month < 12 ? year + ' ' + (parseInt(month) + 1) :
    year + ' 12 31 23:59:59';
  return TaskModel.find({userid : req.params.id, pubDate: {
    '$gte': new Date(minmonth),
    '$lt': new Date(maxmonth)
  }}, function (err, tasks) {
    if (!err) {
      return res.send(tasks);
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      return res.send({ error: 'Server error' });
    }
  });
});

app.post('/api/tasks', isLoggedIn, function(req, res) {
  var task = new TaskModel({
    title: req.body.title,
    userid: req.body.userid,
    link: req.body.link,
    time: req.body.time
  });

  task.save(function (err) {
    if (!err) {
      log.info('task created');
      return res.send({ status: 'OK', task : task });
    } else {
      console.log(err);
      if (err.name == 'ValidationError') {
        res.statusCode = 400;
        res.send({ error: 'Validation error' });
      } else {
        res.statusCode = 500;
        res.send({ error: 'Server error' });
      }
      log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
  });
});
/*
app.get('/api/tasks/:id', function(req, res) {
  return TaskModel.findById(req.params.id, function (err, task) {
    if(!task) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send({ status: 'OK', task:task });
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s',res.statusCode,err.message);
      return res.send({ error: 'Server error' });
    }
  });
});
*/
app.put('/api/tasks/:id', isLoggedIn, function (req, res) {
  return TaskModel.findById(req.params.id, function (err, task) {
    if (!task) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }

    task.title = req.body.title;
    task.link = req.body.link;
    task.time = req.body.time;
    return task.save(function (err) {
      if (!err) {
        log.info('task updated');
        return res.send({ status: 'OK', task : task });
      } else {
        if (err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
      }
    });
  });
});

app.delete('/api/tasks/:id', isLoggedIn, function (req, res) {
  return TaskModel.findById(req.params.id, function (err, task) {
    if (!task) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    return task.remove(function (err) {
      if (!err) {
        log.info('task removed');
        return res.send({ status: 'OK' });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  });
});

app.put('/api/users/:id', isLoggedIn, function(req, res) {
  return User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }

    user.cost = req.body.cost;
    return user.save(function (err) {
      if (!err) {
        log.info('user updated');
        return res.send({ status: 'OK', user: user });
      } else {
        if (err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
      }
    });
  });
});

app.get('/api/excel/:year/:month', isLoggedIn, function(req, res) {
  var conf = {};
  conf.cols = [
    {
      caption: 'Дата',
      type: 'string',
      width: 30
    },
    {
      caption: 'Название',
      type: 'sting',
      width: 50
    },
    {
      caption: 'Ссылка',
      type: 'string',
      width: 50
    },
    {
      caption: 'Время',
      type: 'number',
      width: 30
    }
  ];
  var year = req.params.year;
  var month = req.params.month;
  var minmonth = year + ' ' + parseInt(month);
  var maxmonth = year + ' ' + (parseInt(month) + 1);
  return TaskModel.find({userid : req.user._id, pubDate: {
    '$gte': new Date(minmonth),
    '$lt': new Date(maxmonth)
  }}, function (err, tasks) {
    if (!err) {
      conf.rows = [];
      tasks.forEach(function(task) {
        conf.rows.push([
          moment(new Date(task.pubDate)).format('DD.MM.YYYY'),
          task.title,
          task.link,
          moment.duration(parseInt(task.time, 10)).asHours().toFixed(2)
        ]);
      });
      console.log(conf.rows);
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
      res.end(result, 'binary');
    } else {
      res.statusCode = 500;
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      return res.send({ error: 'Server error' });
    }
  });
});

var bower = 'HOME=$HOME/app-root/runtime ./node_modules/.bin/bower install';
bower = process.env.OPENSHIFT_REPO_DIR ? bower : bower.substr(28);
bower = require('child_process').exec(bower);
bower.on('exit', function() {
  http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});
