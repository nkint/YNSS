short description:
read serial data from arduino and push them into a websocket connection to the pc

installation:
install node, serialport and ws via opkg
disable the arduino Bridge commenting /etc/inittab
assure that the pc and the yun are in the same network
retrive the pc ip address via ipconfig and modify the line in serial2ws.js

usage:
upload EchoSerial.ino via Arduino IDE
open the Serial Monitor in the Arduino IDE
launch in the pc:
    pClient.sh
launch inside the linux in the yun:
    node oSerial2ws.js 