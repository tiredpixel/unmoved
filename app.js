
/**
 * unmoved
 */

var express = require('express');
var http    = require('http');
var url     = require('url');


// Set up server (Node.js Express).

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler());
  app.use(express.static(__dirname));
});


// Define routes.

var pages_objects = require('./routes/pages_objects');

var checkOrigin = function(req, res, next) {
  if (typeof req.headers.origin !== 'undefined') {
    var origin = url.parse(req.headers.origin);
    
    if (typeof process.env.REMOTE_HOST === 'undefined' ||
        (typeof origin.host !== 'undefined' &&
        origin.host == process.env.REMOTE_HOST)) {
      next();
    }
  }
}

var pages_objectsBefore = function(req, res, next) {
  if (typeof req.params.page_id !== 'undefined') {
    var page_id = url.parse(req.params.page_id);
    
    if (typeof process.env.REMOTE_HOST === 'undefined' ||
        (typeof page_id.host !== 'undefined' &&
        page_id.host == process.env.REMOTE_HOST)) {
      next();
    }
  }
}

app.configure('production', function() {
  app.all('/*', checkOrigin);
});

app.all('/pages/:page_id/objects*', pages_objectsBefore);

app.post('/pages/:page_id/objects/:object_id', pages_objects.update);
app.get( '/pages/:page_id/objects',            pages_objects.index);


// Run server.

http.createServer(app).listen(app.get('port'), function() {
  console.log('[server]', 'listening on ' + app.get('port'));
});