
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var log = require('./server/log')(module);
var config  = require('./server/config');
var routes = require('./routes');
var PostModel = require('./server/mongoose').PostModel;
var User = require('./server/mongoose').User;
var api = require('./routes/api');
var passport = require('passport');
var flash = require('connect-flash');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/', routes.index);
app.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
});

var LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
    });

}));

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login'
}));

app.get('/api', function(req, res) {
	res.send('API is running');
});

app.get('/api/posts', function(req, res) {
    return PostModel.find(function (err, posts) {
        if (!err) {
            return res.send(posts);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/api/posts', function(req, res) {
    var post = new PostModel({
        title: req.body.title,
        content: req.body.content,
    });

    post.save(function (err) {
        if (!err) {
            log.info("post created");
            return res.send({ status: 'OK', post:post });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.get('/api/posts/:id', function(req, res) {
    return PostModel.findById(req.params.id, function (err, post) {
        if(!post) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', post:post });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/api/posts/:id', function (req, res){
    return PostModel.findById(req.params.id, function (err, post) {
        if(!post) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        post.title = req.body.title;
        post.content = req.body.content;
        post.modDate = new Date;
        return post.save(function (err) {
            if (!err) {
                log.info("post updated");
                return res.send({ status: 'OK', post:post });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

app.delete('/api/posts/:id', function (req, res){
    return PostModel.findById(req.params.id, function (err, post) {
        if(!post) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return post.remove(function (err) {
            if (!err) {
                log.info("post removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
