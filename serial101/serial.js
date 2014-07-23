var serialport = require("serialport");
var SerialPort = serialport.SerialPort
var serialPort = new SerialPort("/dev/ttyATH0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\r\n")
}, false);

console.log("hello");

serialPort.on("open", function () {
    console.log('open');
});

serialPort.on('data', function(data) {
    console.log('data received: ' + data);
});

serialPort.on('error', function(err) {
    console.log('error: '+err);
});

serialPort.open();
