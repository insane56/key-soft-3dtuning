'use strict';

var app = require('./app'),
    http = require('http'),
    log = require('./libs/log')(module);

//app.set('port', process.env.PORT || 3000);
var inter = setupVariables();
function setupVariables() {
    //  Set the environment variables we need.
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || null;
    var port      = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');

    return {ip: ipaddress, port: port};
}
var server = http.createServer(app);

//WebSockets
require('./websocket').init(server, app.apiServerV1);
server.listen(inter.port, inter.ip, function(){
    log.info('Express server listening on port ' + app.get('port'));
});