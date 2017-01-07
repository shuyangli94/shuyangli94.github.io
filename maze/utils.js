// GLOBAL VARIABLES
var startColor = "#00FF00";
var endColor = "#FF0000";
var mazeCanvas = document.getElementById("mazeCanvas");
var context = mazeCanvas.getContext("2d");
var scaling = 8;
var delay;
var startY;
var endY;
var maze;
var minr = 50;
var maxr = 150;
var playerX;
var playerY;
var stepsTaken;
var ready = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function setDimensionConstraints(min_rows = minr, max_rows = maxr) {
	minr = min_rows;
	maxr = max_rows;
	document.getElementById("mazeRows").value = min_rows;
	document.getElementById("mazeCols").value = min_rows;
	document.getElementById("dimConstraints").innerHTML = "Generate a maze between " + min_rows + " x " + min_rows + " and " + max_rows + " x " + maxr + " in size!";
}

setDimensionConstraints(80, 150);

function validateRC() {
	rowSelector = document.getElementById("mazeRows");
	colSelector = document.getElementById("mazeCols");
	console.log("Input: " + rowSelector.value + " x " + colSelector.value);
	rowSelector.value = Math.max(Math.min(rowSelector.value, maxr), minr);
	colSelector.value = Math.max(Math.min(colSelector.value, maxr), minr);
	console.log("Creating a " + rowSelector.value + " x " + colSelector.value + " maze");
	return {
		"rows": rowSelector.value,
		"cols": colSelector.value
	}
}

function toggleAdvOptions() {
	if (document.getElementById("advancedOptions").style.visibility == 'hidden') {
		document.getElementById("advancedOptions").style.visibility = 'visible';
		document.getElementById("advToggle").innerHTML = 'Basic Options';
	} else {
		document.getElementById("advancedOptions").style.visibility = 'hidden';
		document.getElementById("advToggle").innerHTML = 'Advanced Options';
	}
}

function toggleHint() {
	if (document.getElementById("hint").style.visibility == 'hidden') {
		if (maze != null) {
			document.getElementById("hint").style.visibility = 'visible';
			document.getElementById("distLeft").innerHTML = ready ? getDistance(playerX, playerY, grid.length-1, endY) : 0;
			document.getElementById("hintToggle").innerHTML = 'Hide Hint';
			document.getElementById("distColor").style.visibility = 'visible';
			document.getElementById("showPath").style.visibility = 'visible';
			document.getElementById("clearMaze").style.visibility = 'visible';
		}
	} else {
		if (maze != null) {
			drawMaze(maze, true);
		}
		document.getElementById("hint").style.visibility = 'hidden';
		document.getElementById("hintToggle").innerHTML = 'Show Hints';
		document.getElementById("distColor").style.visibility = 'hidden';
		document.getElementById("showPath").style.visibility = 'hidden';
		document.getElementById("clearMaze").style.visibility = 'hidden';
	}
}
