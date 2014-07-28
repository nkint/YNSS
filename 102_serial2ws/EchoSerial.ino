#include <Bridge.h>

void setup() {
  Serial1.begin(9600);
  Serial.begin(9600);
  
  Serial1.println("Hello");
  delay(1000);
}

void loop() {
  String s = "";
  while (Serial1.available() > 0) {
    char inByte = Serial1.read();
    s += inByte;
  }
  if(s.length() > 0) {
    Serial.println(s);
    s = "";  
  }
}
