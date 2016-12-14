#include <avr/pgmspace.h>               //AVR library for writing to ROM
#include <Charliplexing.h>              //Imports the library, which needs to be
//Initialized in setup.

const unsigned int blinkdelay = 50;    //Sets the time each frame is shown (milliseconds)
byte brightness = 7;                    //Brightness goes from 0-7

byte incomingData;
int row;
int col;

int matrix[][14] = {
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
};

int index = 0;

void setup() {
  LedSign::Init();                      //Initializes the screen
  Serial.begin(115200);
}

void loop() {
  
  while (Serial.available() > 0) {   // see if there's incoming seriaincomingData
    char inByte = Serial.read();
    if (inByte == '0') {
      matrix[index % 9][index / 9] = 0;
    }
    if (inByte == '1') {
      matrix[index % 9][index / 9] = 1;
    }
    if (index >= 126 || inByte == '\t' || inByte == '\n') {
      Serial.println(index);
      Serial.println("Resetting the matrix");
      index = 0;
    }
    else {
      index = index + 1;
    }
  }

//  for (row = 0; row < 9; row++){
//    for(col = 0; col < 14; col++){
//      LedSign::Set(col, row, matrix[row][col]*0);
//    }
//  }
  LedSign::Clear();
  byte randomRow = random(9);
  byte randomCol = random(14);

  if (matrix[randomRow][randomCol] == 1) {
    LedSign::Set(randomCol, randomRow, 7);
    delay(blinkdelay);
  }

  // prints matrix values to serial monitor  **which slows down each frame significantly
  //  for (int row = 0; row < 9; row++){
  //    for (int col = 0; col < 14; col++){
  //    Serial.print(matrix[row][col]);
  //    }
  //    Serial.println();
  //  }
  //  Serial.println();



}
