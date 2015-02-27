"use strict";

var log = require('./libs/log')(module);
var async = require('async');

log.info('Initialize NoSQL database');
require("./init/db").init({
    db: 'mongodb://heroku:by17P2P2qidoHuHjoN8lu_9fETRjlZxDj0PkHxl7xhXWxGGAIqeTr8pOk3TfJRn8jo8NPf5XkN-isE8BpLA6Cg@candidate.33.mongolayer.com:10079,candidate.32.mongolayer.com:10079/app20470433'
    //db: 'mongodb://localhost/tuning'
    //db: 'mongodb://heroku:BrU1Shf5SRjbEg-jzW6ujKEt1GDZ3FBYiCsTlPFouqsDUcLg4aFaRPoFwZdzyEFToTFt1qMj5bFxcrLXnjX0JA@candidate.33.mongolayer.com:10303/app20470521'
}, true);


var filePaths = require('./migration/componentFilePaths');
var bodyCt = require('./migration/createBodyComponentTypes');

var ids = [7,
    6, 8, 9, 10, 12, 13, 17, 24, 25, 30, 32, 36, 37, 45, 46, 47, 48, 49, 198, 304, 355, 465, 130, 199, 185, 191, 201, 219, 203, 223, 224, 228, 232, 234, 237, 239, 265, 266, 253, 279, 243, 285, 280, 320, 329, 283, 292, 296, 297, 324, 349, 379, 342, 346, 373, 361, 395, 350, 387, 397, 406, 411, 420, 434, 438, 460, 457, 464, 466, 468, 469, 472, 473, 471, 474, 129
];


return async.series({
    bodyCt: function (cb) {
        bodyCt.startMigration(null, null, ids, cb);
    },
    componentsPath: function (cb) {
        filePaths.startMigration(null, null, ids, cb);
    }/*,
    componentsSize: function (cb) {
        fileSizes.startMigration(null, null, [304], cb);
    }*/

}, function (err, results) {
    if (err) {
        log.error(err);
    } else {
        log.info('All migrations done successfully ');
        log.info(results);
    }

    process.exit(0);
});
