// GLOBAL VARIABLES
var mazeCanvas = document.getElementById("mazeCanvas");
var context = mazeCanvas.getContext("2d");
var scaling = 10;
var minN = 1;
var maxN = 4;
var delay;
var startY;
var endY;
var maze;

// HELPER FUNCTIONS

function drawMaze(mazeGrid) {
	console.log("Drawing maze");
	context.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
	var xdim = Object.keys(mazeGrid).length;
	var ydim = mazeGrid[0].length;
	console.log("Maze of dimensions " + xdim + " x " + ydim);
	for (var i = 0; i < xdim; i++) {
		for (var j = 0; j < ydim; j++) {
			if (mazeGrid[i][j] == 0) {
				context.fillRect(i*scaling, j*scaling, scaling, scaling);
			}
		}
	}
	context.fillStyle = "#00FF00"; // Greeen: start
	context.fillRect(0*scaling, startY*scaling, scaling, scaling);
	context.fillStyle = "#FF0000"; // Red: end
	context.fillRect((xdim - 1)*scaling, endY*scaling, scaling, scaling);
	context.fillStyle = "#000000"; // Reset color
}

function genMazeArray(rows, cols) {
	var arr = new Array(cols);
	for (var i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
		for (var j = 0; j < rows; j++) {
			arr[i][j] = 0;
		}
	}
	// Starting point
	startY = randInt(2,rows - 2);
	arr[0][startY] = 1;
	// Ending point
	endY = randInt(2,rows - 2);
	arr[cols - 1][endY] = 1;
	return arr;
}

function initCellularAutomaton(mazeGrid) {
	var newGrid = jQuery.extend(true, {}, mazeGrid);
	var xdim = Object.keys(mazeGrid).length;
	var ydim = mazeGrid[0].length;
	for (var i = 1; i < xdim - 1; i+=10) {
		for (var j = 1; j < ydim - 1; j+=10) {
			newGrid[i][j] = Math.random() < 0.30 ? 0 : 1;
		}
	}
	drawMaze(newGrid);
	return newGrid;
}

function iterateCellularAutomaton(mazeGrid) {
	var newGrid = jQuery.extend(true, {}, mazeGrid);
	var xdim = Object.keys(mazeGrid).length;
	var ydim = mazeGrid[0].length;
	for (var i = 1; i < xdim - 1; i++) {
		for (var j = 1; j < ydim - 1; j++) {
			var sum = neighborSum(mazeGrid, i, j);
			if (sum >= minN && sum <= maxN) {
				newGrid[i][j] = 1;
			} else {
				newGrid[i][j] = 0;
			}
		}
	}
	return newGrid;
}

function neighborSum(mazeGrid, x, y) {
	var sum = 0;
	var xdim = Object.keys(mazeGrid).length;
	var ydim = mazeGrid[0].length;
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			sum += mazeGrid[x+i][y+j];
		}
	}
	return sum;
}

function isSolvable(mazeGrid) {
	var xdim = Object.keys(mazeGrid).length;
	var ydim = mazeGrid[0].length;
	grid = jQuery.extend(true, {}, mazeGrid);
	floodFill(0, startY, enum_FILLED, xdim, ydim);
	if (grid[xdim - 1][endY] != enum_FILLED) {
		return false;
	} else {
		return true;
	}
}

// INVOKED BY USER

async function createMaze() {
	delay = document.getElementById("sleepSec").value;
	dims = validateRC();
	nCol = dims.cols * 1;
	nRow = dims.rows * 1;
	mazeCanvas.width = nCol * scaling;
	mazeCanvas.height = nRow * scaling;
	mazeCanvas.style = null;
	maze = genMazeArray(nRow, nCol);
	maze = initCellularAutomaton(maze);
	for (var i = 0; i < 50; i++) {
		maze = iterateCellularAutomaton(maze);
		await sleep(delay);
		drawMaze(maze);
	}
	while(!isSolvable(maze)) {
		maze = iterateCellularAutomaton(maze);
		await sleep(delay);
		drawMaze(maze);
	}
	drawMaze(maze);
}