// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("HELLO");

var canvas = document.getElementById("fair_image");
var image = new Image();
image.src = 'fair_map.JPG';

var ctx = canvas.getContext("2d");

var aquabot_x = 0;
var aquabot_y = 0;

window.setInterval(function(){

  // Test moving aquabot
  aquabot_x += 1;
  aquabot_y += 1;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image
  ctx.drawImage(image, 0, 0);

  // Set the color
  ctx.fillStyle = "#0600ff";

  // Draw the rectangle marker
  ctx.fillRect(aquabot_x, aquabot_y, 3, 3);
}, 10);

