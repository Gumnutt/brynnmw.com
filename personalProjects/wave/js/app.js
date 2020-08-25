'use strict';

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var lines = [];
//colours are sorted in an array constructed of ['bulkColour','lineColour']
var colors = [['#333', '#ffcc00'],['#fff','#000'],['#fff','#69D2E7'],['#69d2e7','#fff'],['#FF7939', '#64585A']];

var colorIndex = -1;

var step = 0,
    width = 0,
    height = 0;

document.ontouchstart = color;
document.onmousedown = color;
window.onresize = setup;

setup();
color();
update();

function setup() {

  width = window.innerWidth, height = window.innerHeight;

  lines.length = 0;

  var lineCount = height / 12;
  var pointCount = 15;
  var spacingH = width / pointCount;
  var spacingV = height / lineCount;

  for (var v = 0; v < lineCount; v++) {

    var line = { points: [], ran: 0.2 + Math.random() * 0.5 };

    for (var h = 0; h < pointCount; h++) {
      line.points.push({
        nx: h * spacingH,
        ny: v * spacingV
      });
    }

    line.points.push({
      nx: width + spacingH,
      ny: v * spacingV
    });

    lines.push(line);
  }
}

function color() {

  colorIndex = ++colorIndex % colors.length;
  canvas.style.backgroundColor = colors[colorIndex][0];
}

function update() {

  step += 0.8;

  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);

  context.lineWidth = 2.5;
  context.strokeStyle = colors[colorIndex][1];
  context.fillStyle = colors[colorIndex][0];

  lines.forEach(function (line, v) {

    context.beginPath();

    line.points.forEach(function (point, h) {

      point.x = point.nx, point.y = point.ny + Math.sin((point.x * line.ran + (step + point.ny)) / 40) * (6 + point.ny / height * 34);
    });

    line.points.forEach(function (point, h) {

      var nextPoint = line.points[h + 1];

      if (h === 0) {
        context.moveTo(point.x, point.y);
      } else if (nextPoint) {
        var cpx = point.x + (nextPoint.x - point.x) / 2;
        var cpy = point.y + (nextPoint.y - point.y) / 2;
        context.quadraticCurveTo(point.x, point.y, cpx, cpy);
      }
    });

    context.stroke();

    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();
    context.fill();
  });

  requestAnimationFrame(update);
}