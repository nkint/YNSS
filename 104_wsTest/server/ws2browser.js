
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    WebSocketServer = require('ws').Server;

var clientPath = '../browser/',
    port = process.argv[2] || 3000;

// -------------------------------------------------------------------------
// a server that serve static files (html, css, ..)
// http://stackoverflow.com/a/13635318/433685

var app = http.createServer(function(request, response) {

    var uri = clientPath+url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, 'binary', function(err, file) {
            if(err) {        
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        });
    });
}).listen(parseInt(port, 10));
console.log('Server running at port ' + port + '\nCTRL + C to shutdown');

// -------------------------------------------------------------------------
// the websocket server
// https://github.com/einaros/ws/blob/master/examples/serverstats/server.js

var wss = new WebSocketServer({server: app});
wss.on('connection', function(ws) {

    var n = {
        time: new Date().toJSON(),
        count: 0
    }

    var id = setInterval(function() {
        n.count++;
        if(n.count>20) {
            n.count = 0;
        } 

        ws.send(JSON.stringify(n), function() { 
            /* ignore errors */ 
        });
    }, 100);
    console.log('started client interval');
    
    ws.on('close', function() {
        console.log('stopping client interval');
        clearInterval(id);
    })
});

