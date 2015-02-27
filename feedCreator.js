"use strict";

var sql = require('mssql');
var log = require('./libs/log')(module);
var async = require('async');


log.info("[INFO] Reading configurations");
var config = require('./config');


//config.elasticSearch.host = 'http://paas:661f22b1e1fd85a6b506110570393f2a@api.searchbox.io';
config.elasticSearch.host = 'https://7b4mhjzh:bxz2pcc749rbof61@cypress-8533468.us-east-1.bonsai.io:443';
// stagconfig.elasticSearch.host = 'http://paas:0a39dcb825c7f9800cb8b389c946179f@dwalin-us-east-1.searchly.com';
log.info('Initialize NoSQL database');
require("./init/db").init({
    // staging db: 'mongodb://heroku:by17P2P2qidoHuHjoN8lu_9fETRjlZxDj0PkHxl7xhXWxGGAIqeTr8pOk3TfJRn8jo8NPf5XkN-isE8BpLA6Cg@candidate.33.mongolayer.com:10079,candidate.32.mongolayer.com:10079/app20470433'
    //db: 'mongodb://localhost/tuning'
    db: 'mongodb://heroku:BrU1Shf5SRjbEg-jzW6ujKEt1GDZ3FBYiCsTlPFouqsDUcLg4aFaRPoFwZdzyEFToTFt1qMj5bFxcrLXnjX0JA@candidate.33.mongolayer.com:10303/app20470521'
}, true);


var feedCreator = require('./migration/feedCreator');

var tunings = require('./migration/tuning');

feedCreator.startMigration({
    comments: false,
    users: false,
    tunings: false,
    ratings: false,
    fixLikes: false,
    fixComments: false,
    fixDoubledComments: false,
    fixTimeline: false,
    prepareUserIndex: false,
    reindexUsers: true,
    reindexTunings: true,
    fixTuningTimelineDate: false,
    fixMainTunings: false
},function(err) {
    if (err) {
        log.error('An error occurred during feed creating process');
        console.log(err);
    }

    process.stdout.write('\x07');

    log.info('Feed creating finished successfully');

    process.exit(0);
});

