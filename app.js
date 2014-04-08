
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var log = require('./server/log')(module);
var config  = require('./server/config');
var routes = require('./routes');
var PostModel = require('./server/mongoose').PostModel;
var api = require('./routes/api');
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
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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
