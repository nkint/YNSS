var serial = require("serialport");
var SerialPort = serial.SerialPort
var serialPort = new SerialPort("/dev/ttyATH0", {
    baudrate: 9600,
    parser: serial.parsers.readline("\r\n")
}, false);

var WebSocket = require('ws');
var ws = null;

function openWS() {
    ws = new WebSocket('ws://192.168.10.44:2000');
    ws.on('open', function() {
        ws.send('I am serial2ws.js, and I\'m bridging the serial to the 32u4');
    });
    ws.on('message', function(data, flags) {
        console.log('receiving data: '+data+'\nflags: '+flags);
        serialPort.write(data);
    });
};

serialPort.on("open", function () {
    console.log('serial opened');
    openWS();
});

serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    if(ws) {
        ws.send(data+'\n');
    }
});

serialPort.on('error', function(err) {
    console.log('error: '+err);
});

serialPort.open();
