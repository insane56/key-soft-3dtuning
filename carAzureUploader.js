var log = require('./libs/log')(module);

log.info('Initialize NoSQL database');
require("./init/db").init({
    // staging db: 'mongodb://heroku:by17P2P2qidoHuHjoN8lu_9fETRjlZxDj0PkHxl7xhXWxGGAIqeTr8pOk3TfJRn8jo8NPf5XkN-isE8BpLA6Cg@candidate.33.mongolayer.com:10079,candidate.32.mongolayer.com:10079/app20470433'
    db: 'mongodb://localhost/tuning'
    //db: 'mongodb://heroku:BrU1Shf5SRjbEg-jzW6ujKEt1GDZ3FBYiCsTlPFouqsDUcLg4aFaRPoFwZdzyEFToTFt1qMj5bFxcrLXnjX0JA@candidate.33.mongolayer.com:10303/app20470521'
}, true);


var carAzureUploader = require('./migration/carAzureUploader');

log.debug('Start time' + new Date());

carAzureUploader.initAzureAndStart(function(err) {
    if (err) {
        log.error('An error occurred during azure uploading process');
        console.log(err);
    }

    log.info('Azure uploading finished successfully');
    log.debug('End time' + new Date());

    process.exit(0);
});

