'use strict';
var env = process.env.NODE_ENV || 'dev';

/*if(env !== 'dev'){
    var newrelic = require('newrelic');
}*/

var express = require('express')
  , fs = require('fs')
  , RedisStore = require('connect-redis')(express)
  , passport = require('passport')
  , expressValidator = require('express-validator')
  , gzippo = require('gzippo')
  , path = require('path')
  , log = require('./libs/log')(module)
  , load = require('express-load-ns')
  , userActivity = require('./libs/user-activity.middleware')
  , geoip = require('geoip-lite')
  , _ = require('underscore');

// Load configurations
log.info("Reading configurations");
var config = require('./config');

var cookieSecret = 'h827sh20f78jksdflKjhskYW';

// Init Azure Service
log.info('Initializing Azure Service');
require('./libs/azure/blobServiceWrapper').init(config);

//Init DB
require("./init/db").init(config, true);

//Init shortId seed
require('shortid').seed(new Date().getTime() * Math.random());

//Init Redis
log.info('Initializing Redis Connection');
require('./libs/redis').init(config, require('redis'));

//Init ElasticSearch
log.info('Initializing ElasticSearch Connection');
require('./libs/elasticSearch/elasticSearch').init(config);
require('./libs/elasticSearch/elasticSearchTuning').createIndexAndMapping();
require('./libs/elasticSearch/elasticSearchUser').createIndexAndMapping();

//Init passport-js authentication
log.info("Initializing authentication module");
var auth = require('./auth');
auth.boot(passport, config);

var app = express();

//Init mailer
log.info("Initializing mailer module");
require("./mailer").init(config);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.enable('trust proxy');

if (env == 'dev') {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
}

app.use(require('./corsSupport'));
if(env !== 'dev') {
    var compressFilter = function (req, res) {
        return !res.getHeader('X-Cached') && /json|text|javascript|dart|image\/svg\+xml|application\/x-font-ttf|application\/vnd\.ms-opentype|application\/vnd\.ms-fontobject|application\/xml/.test(res.getHeader('Content-Type'));
    };
    app.use(express.compress({
        filter: compressFilter
    }));
}
app.use(express.static(path.join(__dirname, 'public-seo'), {maxAge: 7 * 24 * 60 * 60 * 1000}));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 7 * 24 * 60 * 60 * 1000}));
app.use(express.favicon(__dirname + '/public/img/favicon.png'));
//app.use(express.  bodyParser({limit: '3mb'}));
app.use(express.urlencoded({limit: '10mb'}));
app.use(express.json({limit: '10mb'}));
app.use(expressValidator());
app.use(express.methodOverride());

app.use(express.cookieParser(cookieSecret));

app.use(passport.initialize());
app.use(auth.getUserByToken);
app.use(userActivity.userActivity);

//Init view locals
var escapeCountries = [/*'US','CA', 'UA','RU'*/];
require('./viewLocals').init(app, env);
app.use(function (req, res, next) {
    if(typeof req.cookies.showStore !== 'undefined'){
        app.locals.showStore = req.cookies.showStore;
    }else{
        var geo = geoip.lookup(req.ip);
        if(geo){
            var bool = escapeCountries.indexOf(geo.country) === -1;
            res.cookie('showStore', bool);
            app.locals.showStore = bool;
        }else{
            res.cookie('showStore', true);
            app.locals.showStore = true;
        }
    }
    next();
});
//app.locals.newrelic = newrelic;

log.info('Initializing express: /api/v1 server');
var apiServerV1 = require('./api/v1');
app.set('apiServerV1',apiServerV1);
app.use('/api/v1', apiServerV1);

app.use(app.router);

app.use(function(req, res) {
    res.status(404);
    res.render('error/404');
});

//for WebSockets
app.apiServerV1 =apiServerV1;
app.config = config;
app.cookieSecret = cookieSecret;




//Init routes
var routePath = __dirname + '/routes/index';
var route = require(routePath);
route.init(app);
log.info("Route initialized: index.js");




/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
 function terminator(sig){
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating sample app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
}


/**
 *  Setup termination handlers (for exit and a list of signals).
 */
(function(){
    //  Process on exit and signals.
    process.on('exit', function() { terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() { terminator(element); });
    });
})();


module.exports = app;