var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');

var server = http.createServer(function (req, res) {
    if (/^\/pricing(\/|$)/.test(req.url)) req.url = '/';
    ecstatic(req, res);
});
server.listen(5000);
