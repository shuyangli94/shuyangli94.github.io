// GLOBAL VARIABLES
var canvas = document.getElementById("dagCanvas");
var context = canvas.getContext("2d");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}


var RECIPE = {
	'name': '1956   stuffed onions',
	'ingredients': ['onions','boiling water','salt','sausage','navy beans','pepper','dry mustard','breadcrumbs','celery tops','brown sugar'],
	'steps': [
		'cook onions in the boiling, salted water for 20 minutes; drain and cool.',
		'cook sausage in frying pan until lightly browned; drain off fat.',
		'remove the centers of the onions, leaving a bottom so that the filling does not fall through; set aside.',
		'add beans, chopped onion centers, and seasonings to cooked sausage; mix well.',
		'divide mixture and stuff into the 6 onion"bowls" you have created; place in baking dish.',
		'mix bread crumbs, celery, and brown sugar together; sprinkle onto the top of each onion.',
		'bake onions at 350 degrees f for 30 minutes.',
		'wonderful when served with fresh, steamed green beans and clover leaf rolls.'
	]
};


// GLOBAL VARIABLES
var startColor = "#00FF00";
var endColor = "#FF0000";
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
