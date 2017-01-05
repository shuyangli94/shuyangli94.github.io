function initializePlayer() {
	playerX = 0;
	playerY = startY;
	drawPlayer(playerX, playerY);
	stepsTaken = 0;
	ready = true;
	updatePlayerStats();
}

function drawPlayer(x, y) {
	var pix = scaling / 2;
	context.fillStyle = "#000000";
    context.beginPath();
    context.arc(x*pix*2+pix, y*pix*2+pix, pix, 0, 2*Math.PI, false);
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(x*pix*2+pix, y*pix*2+pix, pix/1.8, 0, 2*Math.PI, false);
    context.fillStyle = "#00FFFF";
    context.fill();
}

function updatePlayerStats() {
	document.getElementById("xPos").innerHTML = playerX;
	document.getElementById("yPos").innerHTML = playerY;
	document.getElementById("steps").innerHTML = stepsTaken;
	document.getElementById("distLeft").innerHTML = getDistance(playerX, playerY, grid.length-1, endY);
	document.getElementById("shortest").innerHTML = grid[grid.length-1][endY];
}

function clearStats() {
	document.getElementById("xPos").innerHTML = "0";
	document.getElementById("yPos").innerHTML = "0";
	document.getElementById("steps").innerHTML = "0";
	document.getElementById("distLeft").innerHTML = "0";
	document.getElementById("shortest").innerHTML = "0";
}

function getDistance(x, y, tx, ty) {
	if (document.getElementById("hint").style.visibility == 'hidden') {
		return 0;
	}
	var oldGrid = jQuery.extend(true, [], grid);
	floodFill(x, y, 0, maze.length, maze[0].length);
	var dist = grid[tx][ty];
	grid = oldGrid;
	return dist;
}

function checkKey(e) {
	e.preventDefault();
    e = e || window.event;

    console.log("Key pressed!");

    var potential = [playerX, playerY];
    if (e.keyCode == '38') { // UP y-1
    	potential = [playerX, playerY-1];
    } else if (e.keyCode == '40') { // DOWN y+1 
    	potential = [playerX, playerY+1];
    } else if (e.keyCode == '37') { // LEFT x-1
    	potential = [playerX-1, playerY];
    } else if (e.keyCode == '39') { // RIGHT x+1
    	potential = [playerX+1, playerY];
    } else {
    	return;
    }

    if (isValidTarget(potential)) {
    	if (playerX == 0 && playerY == startY) {
    		context.fillStyle = startColor;
    	} else if (playerX == (maze.length - 1) && playerY == endY) {
    		context.fillStyle = endColor;
    	} else {
    		context.fillStyle = "#FFFFFF";
    	}
    	
    	context.fillRect(playerX*scaling, playerY*scaling, scaling, scaling);
    	playerX = potential[0];
    	playerY = potential[1];
    	drawPlayer(playerX, playerY);
    	stepsTaken += 1;
    	updatePlayerStats();
    	if (playerX == (maze.length - 1) && playerY == endY) {
    		var alertStr = "Congrats! You solved the maze in " + stepsTaken + " moves!";
    		if (stepsTaken == grid[grid.length-1][endY]) {
    			alertStr += "\nYOU FOUND AN OPTIMAL SOLUTION!";
    		}
    		alert(alertStr);
    	}
    }
}

function isValidTarget(targetLocation) {
	var xLimit = maze.length;
	var yLimit = maze[0].length;

	// Out of bounds
	if (targetLocation[0] < 0 || targetLocation[1] < 0 || targetLocation[0] >= xLimit || targetLocation[1] >= yLimit) {
		return false;
	}

	if (maze[targetLocation[0]][targetLocation[1]] == 1) {
		return true;
	}

	return false;
}