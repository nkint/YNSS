short description:
the bonjourWs in the pc discovers the yun via bonjour/zeroconf protocol
and open a websocket over it
(it should work with multiple yun)

install:
install node and ws via opkg
copy avahi conf in /etc/avahi/services
assure that the pc and the yun are in the same network

usage:
switch on the yun, ssh into it and launch:
    cd /usr/lib/node_modules/ws/bin/
    ./wscat -l 2000
from the pc launch:
    node pBonjourWs.js

