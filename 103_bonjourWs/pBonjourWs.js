#!/usr/bin/env node
var mdns    = require('mdns')
    , listOfOscDevices = { /*name: {adresses: ['192.168.0.24', 'fe80::0:18'], port: 10001}}*/ }
    ;

var WebSocket = require('ws');


var mdnsBrowser = mdns.createBrowser(mdns.tcp('podbay'));

function createWebSocket(service) {
    var yunAddress = 'ws://'+service.addresses[0]+':2000';

    var ws = new WebSocket(yunAddress);
    ws.on('open', function() {
        ws.send('something');
    });
    ws.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        console.log(data);
    });

    
    return ws;
}

mdnsBrowser.on('serviceUp', function(service) {
    // ignore duplicate ups
    if(listOfOscDevices[service.name]) return;

    console.log('arduino device "'+service.name+' up at '+service.addresses[0]+':'+service.port+', now '+cnt+' devices on the net');

    listOfOscDevices[service.name] = {
        'addresses': service.addresses, 
        'port': service.port, 
        'ws': createWebSocket(service)
    };
    var cnt = Object.keys(listOfOscDevices).length;
});

mdnsBrowser.on('serviceDown', function(service) {
    // ignore duplicate downs
    if(!listOfOscDevices[service.name]) return;
    var device = listOfOscDevices[service.name];
    delete listOfOscDevices[service.name];
    var cnt = Object.keys(listOfOscDevices).length;
    console.log('arduino device "'+service.name+' down at '+device.addresses[0]+':'+device.port+', now '+cnt+' devices on the net');
});

console.log('listening for arduino-compatible devices on the net\n\n');
mdnsBrowser.start();