// GLOBAL VARIABLES
var startColor = "#00FF00";
var endColor = "#FF0000";
var theCanvas = document.getElementById("theCanvas");
var context = theCanvas.getContext("2d");
var scaling = 8;
var delay;
var startY;
var endY;
var cellCanvas;
var minr = 50;
var maxr = 150;
var playerX;
var playerY;
var stepsTaken;
var playAutomaton = false;
var iterations = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getCursorPosition(event) {
	var rect = theCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x,y];
}

function getGridLocationFromCoordinate(xy) {
	var x = Math.floor(xy[0] / scaling);
	var y = Math.floor(xy[1] / scaling);
	return [x,y];
}

function toggleSquare(xy) {
	var x = xy[0];
	var y = xy[1];
	cellCanvas[x][y] = (cellCanvas[x][y] + 1) % 2;
	drawGrid(cellCanvas, clear=false);
}

theCanvas.addEventListener('click', function(evt) {
	toggleSquare(getGridLocationFromCoordinate(getCursorPosition(evt)));
}, false)

function setDimensionConstraints(min_rows = minr, max_rows = maxr) {
	minr = min_rows;
	maxr = max_rows;
	document.getElementById("cellCanvasRows").value = min_rows;
	document.getElementById("cellCanvasCols").value = min_rows;
	document.getElementById("dimConstraints").innerHTML = "Create a cellular automaton on a canvas between " + min_rows + " x " + min_rows + " and " + max_rows + " x " + maxr + " in size!";
}

setDimensionConstraints(80, 150);

function validateRC() {
	rowSelector = document.getElementById("cellCanvasRows");
	colSelector = document.getElementById("cellCanvasCols");
	console.log("Input: " + rowSelector.value + " x " + colSelector.value);
	rowSelector.value = Math.max(Math.min(rowSelector.value, maxr), minr);
	colSelector.value = Math.max(Math.min(colSelector.value, maxr), minr);
	console.log("Creating a " + rowSelector.value + " x " + colSelector.value + " cellCanvas");
	return {
		"rows": rowSelector.value,
		"cols": colSelector.value
	}
}