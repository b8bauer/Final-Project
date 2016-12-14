var serial;       						   // variable to hold an instance of the serialport library
var portName = "/dev/cu.usbmodem1421"; // fill in your serial port name here

var pixelSize = 60;
var pixelX = [];
var pixelY = [];
var isOverPixel = [];
var pixelStatus = [];
var pixelColor = [];
var pixelRows = 9;
var pixelColumns = 14;
var numOfPixels = 126;

var inputMatrix = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	];

function setup() {
  createCanvas(pixelSize*14, pixelSize*9);
  background(255);
  var host = window.location.host.split(":");
  
  serial = new p5.SerialPort(host[0], Number(host[1]));    // make a new instance of the serialport library
  serial.open(portName);           // open a serial port
  
  // pushes X and Y values to pixel arrays to be used as initializing corners for rectangles in the draw function
	for (var v = 0; v < pixelColumns; v++){
		for (var h = 0; h < pixelRows; h++){
		pixelX.push(v*pixelSize);
		pixelY.push(h*pixelSize);
		}
	}
	
	//pushes "false" hover values to all pixels
	for (var p = 0; p < numOfPixels; p++){
		isOverPixel.push(false);
		pixelColor.push(50);
		pixelStatus.push(false);
	}

}

function draw() {

  // draws pixels and monitors mouse hovering
  for (var i = 0; i < numOfPixels; i++){
  	
  		if (mouseX >= pixelX[i] && mouseX <= pixelX[i]+pixelSize && mouseY >= pixelY[i] && mouseY <= pixelY[i]+pixelSize) {
    		isOverPixel[i] = true;
		} else {
    		isOverPixel[i] = false;
  		}
  		
  		rectMode(CORNERS);
  		if (pixelStatus[i] === true || isOverPixel[i] === true){
  			pixelColor[i] = "red";
  		} else {
  			pixelColor[i] = 50;
  		}
  		fill(pixelColor[i]);
  		rect(pixelX[i], pixelY[i], pixelX[i]+pixelSize, pixelY[i]+pixelSize);   		
  	}

}

// changes color of any pixel that is clicked
function mousePressed() {
	
	for (var i = 0; i < numOfPixels; i++){
		if (isOverPixel[i] === true){
			pixelStatus[i] = !pixelStatus[i];
			
			if (i/9 < 1){
				inputMatrix[0][i] = 1;
			}
			else if (i/9 > 1 && i/9 < 2){
				inputMatrix[1][i-9] = 1;
			}
			else if (i/9 > 2 && i/9 < 3){
				inputMatrix[2][i-18] = 1;
			}
			else if (i/9 > 3 && i/9 < 4){
				inputMatrix[3][i-27] = 1;
			}
		}
	}
	// writes matrix values to console
  	console.log(inputMatrix);
  	// writes matrix values to the serial
  	try {
	  	serial.write(inputMatrix);
  	} catch (e) {
  		console.log(e);
  	}

}