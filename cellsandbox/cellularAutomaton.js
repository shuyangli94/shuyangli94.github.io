// HELPER FUNCTIONS
function drawGrid(theGrid, clear=false) {
	context.clearRect(0, 0, theCanvas.width, theCanvas.height);
	var xdim = theGrid.length;
	var ydim = theGrid[0].length;
	// console.log("Drawing cellCanvas of dimensions " + xdim + " x " + ydim);
	for (var i = 0; i < xdim; i++) {
		for (var j = 0; j < ydim; j++) {
			if (clear) {
				context.fillStyle = theGrid[i][j] == 0 ? "#000000" : "#FFFFFF";
				context.fillRect(i*scaling, j*scaling, scaling, scaling);
			} else {
				if (theGrid[i][j] == 0) {
					context.fillRect(i*scaling, j*scaling, scaling, scaling);
				}
			}
		}
	}
}

function genCanvasArray(rows, cols, initialValue) {
	var arr = new Array(cols);
	for (var i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
		for (var j = 0; j < rows; j++) {
			arr[i][j] = initialValue;
		}
	}
	return arr;
}

function iterateCellularAutomaton(theGrid, birth, survival) {
	var newGrid = jQuery.extend(true, [], theGrid);
	var xdim = theGrid.length;
	var ydim = theGrid[0].length;
	for (var i = 1; i < xdim - 1; i++) {
		for (var j = 1; j < ydim - 1; j++) {
			var sum = neighborSum(theGrid, i, j);
			// console.log(sum + " - birth: " + (birth.indexOf(sum) > -1) + " | survival: " + (survival.indexOf(sum) > -1));
			if (birth.indexOf(sum) > -1 && survival.indexOf(sum) > -1) {
				newGrid[i][j] = 1; // Alive no matter what
			} else if (birth.indexOf(sum) > -1) {
				newGrid[i][j] = theGrid[i][j] == 0 ? 1 : 0; // Born
			} else if (survival.indexOf(sum) > -1) {
				newGrid[i][j] = theGrid[i][j] == 1 ? 1 : 0; // Survive
			} else {
				newGrid[i][j] = 0; // Die
			}
		}
	}
	return newGrid;
}

function neighborSum(theGrid, x, y) {
	var sum = 0;
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			sum += theGrid[x+i][y+j];
		}
	}
	return sum;
}

// INVOKED BY USER
async function stopCellularAutomaton() {
	playAutomaton = false;
}

async function playCellularAutomaton() {
	var ruleset = document.getElementById("ruleset").value;
	// Validate Ruleset
	if (ruleset.match() == null) {
		document.getElementById("ruleset").value = "B3/12345";
		alert("Invalid ruleset: " + ruleset);
		return;
	}

	// Parse the ruleset
	var [birth, survival] = ruleset.split("/");
	birth = birth.split("B")[1].split("").map(Number);
	survival = survival.split("").map(Number);
	console.log(birth);
	console.log(survival);

	playAutomaton = true;
	while(playAutomaton) {
		cellCanvas = iterateCellularAutomaton(cellCanvas, birth, survival);
		iterations++;
		await sleep(delay);
		drawGrid(cellCanvas);
	}
}

async function createMaze(initialValue) {
	// Cleanup
	cellCanvas = null;

	delay = document.getElementById("sleepSec").value;
	dims = validateRC();
	nCol = dims.cols * 1;
	nRow = dims.rows * 1;
	theCanvas.width = nCol * scaling;
	theCanvas.height = nRow * scaling;
	theCanvas.style = null;
	cellCanvas = genCanvasArray(nRow, nCol, initialValue);
	drawGrid(cellCanvas);
	iterations = 0;
}

createMaze(0);