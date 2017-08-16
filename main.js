// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("HELLO");

var canvas = document.getElementById("fair_image");
var portselect = document.getElementById("ports")
console.log(ports)
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

var start_lat = 40.672233;
var start_long = -74.841474;
var end_lat = 40.671406;
var end_long = -74.839740;

var start_x = 0;
var start_y = 0;
var end_x = 955;
var end_y = 598;

var scale = 1;

var long_dist = start_long - end_long;
var lat_dist = start_lat - end_lat;

var dist_x = start_x - end_x;
var dist_y = start_y - end_y;

var aquabot_lat = 40.671547;
var aquabot_long = -74.840057;

// Clear the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(image, 0, 0);

function resize() {
  var img_ratio = image.height / image.width;
  var screen_ratio = window.innerHeight / window.innerWidth;

  if (img_ratio > screen_ratio) {
    scale = window.innerHeight / image.height;
  } else {
    scale = window.innerWidth / image.width;
  }
}

function redraw() {
  var aquabot_x = (((aquabot_long - start_long) / long_dist) * dist_x + start_x) * scale;
  var aquabot_y = (((aquabot_lat - start_lat) / lat_dist) * dist_y + start_y) * scale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);

  // Set the color
  ctx.fillStyle = "#0600ff";

  // Draw the rectangle marker
  ctx.fillRect(aquabot_x - 10, aquabot_y - 10, 20, 20);
}

window.onresize = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resize()
  redraw()
}

var socket = new WebSocket("ws://localhost:8989/ws")

socket.onopen = function (event) {
  console.log("WS Opened");
  console.log(event);
  socket.send("list");
}

socket.onclose = function (event) {
  console.log("WS Close");
  console.log(event);
}

socket.onerror = function (event) {
  console.log("WS Error");
  console.log(event);
}

socket.onmessage = function (event) {
  console.log("WS Message");
  try {
    var data = JSON.parse(event.data);
    //console.log(data);
    if ("SerialPorts" in data) {
      ports = data['SerialPorts'];
      len = ports.length
      for (var p = 0; p < len; p++) {
        port = ports[p];
        var opt = document.createElement('option');
        opt.value = JSON.stringify(port);
        opt.innerHTML = port.Friendly;
        portselect.appendChild(opt);
        if (port.IsOpen) {
          socket.send("close " + port.Name)
        }
      }
      updateSerial()
    } else if ('D' in data) {
      var msg = data.D;
      //console.log(msg);
      var parsed = msg.split(":");
      console.log(parsed);
      if (parsed.length >= 4) {
        aquabot_lat = parsed[3];
        //console.log(aquabot_lat);
        aquabot_long = parsed[4];
        //console.log(aquabot_long);

        // Test moving aquabot
        //aquabot_long += .00001;
        //aquabot_lat += .00001;

        redraw();
      }
    }
  } catch (e) { }
}

var port = null

function updateSerial() {

  // Close the previous port if there was a previous port
  if (port !== null) {
    socket.send("close " + port.Name);
  }

  // Update the current port
  port = JSON.parse(portselect.value);

  console.log("Opening port: " + port.Friendly);

  // Open the new port
  socket.send("open " + port.Name + " 9600");
}

portselect.onchange = updateSerial;


