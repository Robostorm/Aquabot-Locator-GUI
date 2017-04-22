// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

SerialPort = require("serialport");

console.log("HELLO");

var canvas = document.getElementById("fair_image");
var image = new Image();

var ctx = canvas.getContext("2d");

// Fair map
/*
image.src = 'fair_map.JPG';

var start_lat = 40.416623;
var start_long = -74.883628;
var end_lat = 40.413900;
var end_long = -74.880168;

var start_x = 0;
var start_y = 0;
var end_x = 808;
var end_y = 831;
*/

// Tim's House
image.src = 'map.png';

var start_lat  = 40.672233;
var start_long = -74.841474;
var end_lat    = 40.671406;
var end_long   = -74.839740;

var start_x = 0;
var start_y = 0;
var end_x   = 955;
var end_y   = 598;


var long_dist = start_long - end_long;
var lat_dist  = start_lat - end_lat;

var dist_x = start_x - end_x;
var dist_y = start_y - end_y;

var aquabot_lat  = 40.671547;
var aquabot_long = -74.840057;

var port = new SerialPort("/dev/usbtop", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

port.on('data', function (data) {
  console.log('Data: ' + data);
  var parsed = data.split(":");
  console.log(parsed);
  aquabot_lat = parsed[3];
  console.log(aquabot_lat);
  aquabot_long = parsed[4];
  console.log(aquabot_long);
});

console.log('Starting Loop');

window.setInterval(function(){


  // Test moving aquabot
  //aquabot_long += .00001;
  //aquabot_lat += .00001;

  var aquabot_x = ((aquabot_long - start_long)/long_dist)*dist_x + start_x;
  var aquabot_y = ((aquabot_lat - start_lat)/lat_dist)*dist_y + start_y;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image
  ctx.drawImage(image, 0, 0);

  // Set the color
  ctx.fillStyle = "#0600ff";

  // Draw the rectangle marker
  ctx.fillRect(aquabot_x - 10, aquabot_y - 10, 20, 20);
}, 10);

