import processing.serial.*;

Serial port;                      // intiable to hold an instance of the serialport library
String portName = "/dev/cu.usbmodem1421";       // fill in your serial port name here

final int numOfPixels = 126;

final int pixelSize = 60;
int[] pixelX = new int[numOfPixels];
int[] pixelY = new int[numOfPixels];
boolean[] isOverPixel = new boolean[numOfPixels];
boolean[] pixelStatus = new boolean[numOfPixels];
color[] pixelColor = new color[numOfPixels];
int pixelRows = 9;
int pixelColumns = 14;


void setup() {
  size(840, 540);
  background(255);

  port = new Serial(this, portName, 115200);    // make a new instance of the serialport library

  // pushes X and Y values to pixel arrays to be used as initializing corners for rectangles in the draw void
  int i = 0;
  for (int v = 0; v < pixelColumns; v++) {
    for (int h = 0; h < pixelRows; h++) {
      pixelX[i] = (v*pixelSize);
      pixelY[i] = (h*pixelSize);
      i = i + 1;
    }
  }

  //pushes "false" hover values to all pixels
  for (int p = 0; p < numOfPixels; p++) {
    isOverPixel[p] = (false);
    pixelColor[p] = (50);
    pixelStatus[p] = (false);
  }
}

void draw() {
  while (port.available() > 0) {
    String value = port.readStringUntil('\n');
    if (value != null) {
      print(value);
    }
  }
  // draws pixels and monitors mouse hovering
  for (int i = 0; i < numOfPixels; i++) {

    if (mouseX >= pixelX[i] && mouseX <= pixelX[i]+pixelSize && mouseY >= pixelY[i] && mouseY <= pixelY[i]+pixelSize) {
      isOverPixel[i] = true;
    } else {
      isOverPixel[i] = false;
    }

    rectMode(CORNERS);
    if (pixelStatus[i] == true || isOverPixel[i] == true) {
      pixelColor[i] = color(255, 0, 0);
    } else {
      pixelColor[i] = 50;
    }
    fill(pixelColor[i]);
    rect(pixelX[i], pixelY[i], pixelX[i]+pixelSize, pixelY[i]+pixelSize);
  }
}

// changes color of any pixel that is clicked
void mousePressed() {

  for (int i = 0; i < numOfPixels; i++) {
    if (isOverPixel[i] == true) {
      pixelStatus[i] = !pixelStatus[i];

      //if (i/9 < 1) {
      //  inputMatrix[0][i] = 1;
      //} else if (i/9 > 1 && i/9 < 2) {
      //  inputMatrix[1][i-9] = 1;
      //} else if (i/9 > 2 && i/9 < 3) {
      //  inputMatrix[2][i-18] = 1;
      //} else if (i/9 > 3 && i/9 < 4) {
      //  inputMatrix[3][i-27] = 1;
      //}
    }
  }
  // writes matrix values to console
  for (int p = 0; p < numOfPixels; p++) {
    print(pixelStatus[p] ? 1 : 0);
  }
  println();

  // writes matrix values to the serial
  try {
    port.write('\t');
    for (int p = 0; p < numOfPixels; p++) {
      port.write(pixelStatus[p] ? '1' : '0');
    }
    port.write('\n');
  } 
  catch (Exception e) {
    println(e);
  }
}