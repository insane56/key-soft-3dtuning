"use strict";

var sql = require('mssql');
var log = require('./libs/log')(module);
var async = require('async');


log.info("[INFO] Reading configurations");
var config = require('./config');

log.info('Initialize NoSQL database');
require("./init/db").init({
    //db: 'mongodb://heroku:by17P2P2qidoHuHjoN8lu_9fETRjlZxDj0PkHxl7xhXWxGGAIqeTr8pOk3TfJRn8jo8NPf5XkN-isE8BpLA6Cg@candidate.33.mongolayer.com:10079,candidate.32.mongolayer.com:10079/app20470433'
    //db: 'mongodb://localhost/tuning'
    db: 'mongodb://heroku:BrU1Shf5SRjbEg-jzW6ujKEt1GDZ3FBYiCsTlPFouqsDUcLg4aFaRPoFwZdzyEFToTFt1qMj5bFxcrLXnjX0JA@candidate.33.mongolayer.com:10303/app20470521'
}, true);


var users = require('./migration/user');
var cars = require('./migration/car');
var components = require('./migration/components');
var backgrounds = require('./migration/background');
var nullsFixer = require('./migration/nullFixer');
var httpsFixer = require('./migration/https');

var tunings = require('./migration/tuning');
var connectionStrings = {
    mobile: {
        user: '3dtuning@vvf3apdg02.database.windows.net',
        password: 'F8jKlop33',
        server: 'vvf3apdg02.database.windows.net',
        database: '3dtuningdev',
        options: {
            encrypt: true,
            debug: {
                packet: true,
                data: true,
                payload: true,
                token: true,
                log: true
            }
        }
    },
    live: {
        user: '3dtuning@vvf3apdg02.database.windows.net',
        password: 'F8jKlop33',
        server: 'vvf3apdg02.database.windows.net',
        database: '3dtuning',
        options: {
            encrypt: true,
            debug: {
                packet: true,
                data: true,
                payload: true,
                token: true,
                log: true
            }
        }
    }
};


var delta = true;

var liveConnection = new sql.Connection(connectionStrings.live, function (err) {
    if (err) return log.error(err);

    httpsFixer.httpMigrate(function(err) {
        if (err) {
            log.error(err);
        } else {
            log.info('All migrations done successfully');
        }

        process.exit(0);
    });

    return;
    /** DELTA **/
    async.series({
        users: function (cb) {
            users.startMigration(liveConnection, {}, cb);
        },
        backgrounds: function (cb) {
            backgrounds.startMigration(liveConnection, cb);
        },
        tunings: function (cb) {
            return tunings.startMigration(liveConnection, cb);
        },
        nulls: function(cb) {
            nullsFixer.fixNulls(liveConnection, {
                backgrounds: true,
                tunings: true,
                comments: false,
                likes: false,
                fixBg: false
            }, cb);
        }
    }, function (err, results) {
        if (err) {
            log.error(err);
        } else {
            log.info('All DELTA migrations done successfully');
            log.info(results);
        }

        process.exit(0);
    });

});
