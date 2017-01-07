// HELPER FUNCTIONS
function drawMaze(mazeGrid, clear=false) {
	context.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
	var xdim = mazeGrid.length;
	var ydim = mazeGrid[0].length;
	// console.log("Drawing maze of dimensions " + xdim + " x " + ydim);
	for (var i = 0; i < xdim; i++) {
		for (var j = 0; j < ydim; j++) {
			if (clear) {
				context.fillStyle = mazeGrid[i][j] == 0 ? "#000000" : "#FFFFFF";
				context.fillRect(i*scaling, j*scaling, scaling, scaling);
			} else {
				if (mazeGrid[i][j] == 0) {
					context.fillRect(i*scaling, j*scaling, scaling, scaling);
				}
			}
		}
	}
	context.fillStyle = startColor; // Greeen: start
	context.fillRect(0*scaling, startY*scaling, scaling, scaling);
	context.fillStyle = endColor; // Red: end
	context.fillRect((xdim - 1)*scaling, endY*scaling, scaling, scaling);
	context.fillStyle = "#000000"; // Reset color
	if (clear) {
		drawPlayer(playerX, playerY);
	}
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
	var newGrid = jQuery.extend(true, [], mazeGrid);
	var xdim = mazeGrid.length;
	var ydim = mazeGrid[0].length;
	for (var i = 10; i < xdim - 10; i+=10) {
		for (var j = 10; j < ydim - 10; j+=10) {
			newGrid[i][j] = Math.random() < 0.5 ? 1 : 0;
			newGrid[i][j+1] = 1;
			newGrid[i-1][j+1] = 1;
			newGrid[i+1][j] = Math.random() < 0.5 ? 1 : 0;
			newGrid[i-1][j] = Math.random() < 0.5 ? 1 : 0;
		}
	}

	drawMaze(newGrid);
	return newGrid;
}

function iterateCellularAutomaton(mazeGrid, birth, survival) {
	var newGrid = jQuery.extend(true, [], mazeGrid);
	var xdim = mazeGrid.length;
	var ydim = mazeGrid[0].length;
	for (var i = 1; i < xdim - 1; i++) {
		for (var j = 1; j < ydim - 1; j++) {
			var sum = neighborSum(mazeGrid, i, j);
			// console.log(sum + " - birth: " + (birth.indexOf(sum) > -1) + " | survival: " + (survival.indexOf(sum) > -1));
			if (birth.indexOf(sum) > -1 && survival.indexOf(sum) > -1) {
				newGrid[i][j] = 1; // Alive no matter what
			} else if (birth.indexOf(sum) > -1) {
				newGrid[i][j] = mazeGrid[i][j] == 0 ? 1 : 0; // Born
			} else if (survival.indexOf(sum) > -1) {
				newGrid[i][j] = mazeGrid[i][j] == 1 ? 1 : 0; // Survive
			} else {
				newGrid[i][j] = 0; // Die
			}
		}
	}
	return newGrid;
}

function neighborSum(mazeGrid, x, y) {
	var sum = 0;
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			sum += mazeGrid[x+i][y+j];
		}
	}
	return sum;
}

function isSolvable(mazeGrid) {
	var xdim = mazeGrid.length;
	var ydim = mazeGrid[0].length;
	grid = jQuery.extend(true, [], mazeGrid);
	for (var i = 0; i < xdim; i++) {
		for (var j = 0; j < ydim; j++) {
			if (grid[i][j] == 0) {
				grid[i][j] = -Infinity; // Wall
			} else {
				grid[i][j] = Infinity; // Space
			}
		}
	}
	floodFill(0, startY, 0, xdim, ydim);
	if (grid[xdim - 1][endY] == Infinity) {
		return false;
	} else {
		console.log("Solvable in " + grid[xdim - 1][endY] + " moves.");
		return true;
	}
}

// INVOKED BY USER
async function createMazeWrapper() {
	ready = false;
	var ruleset = document.getElementById("ruleset").value;

	// Validate Ruleset
	if (ruleset.match() == null) {
		document.getElementById("ruleset").value = "B3/12345";
		alert("Invalid ruleset: " + ruleset);
		return;
	} else {
		createMaze(ruleset);
	}
}

async function createMaze(ruleset) {
	// Cleanup
	document.getElementById("dimConstraints").innerHTML = "Creating maze...";
	clearStats();
	maze = null;
	document.getElementById("hint").style.visibility = 'hidden';
	document.getElementById("hintToggle").innerHTML = 'Show Hints';
	document.getElementById("distColor").style.visibility = 'hidden';
	document.getElementById("showPath").style.visibility = 'hidden';
	document.getElementById("clearMaze").style.visibility = 'hidden';

	// Parse the ruleset
	var [birth, survival] = ruleset.split("/");
	birth = birth.split("B")[1].split("").map(Number);
	survival = survival.split("").map(Number);
	console.log(birth);
	console.log(survival);

	delay = document.getElementById("sleepSec").value;
	dims = validateRC();
	nCol = dims.cols * 1;
	nRow = dims.rows * 1;
	mazeCanvas.width = nCol * scaling;
	mazeCanvas.height = nRow * scaling;
	mazeCanvas.style = null;
	var newMaze = genMazeArray(nRow, nCol);
	newMaze = initCellularAutomaton(newMaze);
	var iterations = 0;
	for (var i = 0; i < 50; i++) {
		newMaze = iterateCellularAutomaton(newMaze, birth, survival);
		await sleep(delay);
		drawMaze(newMaze);
		iterations++;
	}
	while(true) {
		newMaze = iterateCellularAutomaton(newMaze, birth, survival);
		iterations++;
		if (iterations > 300) {
			document.getElementById("dimConstraints").innerHTML = "Could not generate valid maze after 300 generations. Please try again.";
			return;
		}
		await sleep(delay);
		drawMaze(newMaze);
		if (isSolvable(newMaze)) {
			break;
		}
	}

	maze = newMaze;

	// Populate buttons and dialogues
	document.getElementById("dimConstraints").innerHTML = "Valid maze created after " + iterations + " generations of cellular automata!<br /><b>Explore</b> it with the L R U D arrow keys!";

	drawMaze(maze, clear=true);

	// Initialize game
	mazeCanvas.addEventListener("keydown", checkKey, true);
	initializePlayer();
}