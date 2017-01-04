var Stack = [];
var grid;
var distance0color = "#6386EE";
var pathColor = "#FFB270";

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function colorSolutionGrid() {
	var maxSteps = Math.max.apply(null, grid.map(maxNoInfinity));
	for (var i = 1; i < grid.length - 1; i++) {
		for (var j = 1; j < grid[0].length - 1; j++) {
			if (Math.abs(grid[i][j]) != Infinity) {
				context.fillStyle = shadeColor2(distance0color, (1-(grid[i][j]/maxSteps)));
				context.fillRect(i*scaling, j*scaling, scaling, scaling);
			}
		}
	}
}

function drawShortestPath(pathStack) {
	context.fillStyle = pathColor;
	pathStack.forEach(function(e) {
		if (e[0] != 0 && e[0] != grid.length-1) {
			context.fillRect(e[0]*scaling, e[1]*scaling, scaling, scaling);
		}
	});
}

function findShortestPath() {
	var pathStack = [];
	pathStack.push([grid.length-1, endY, grid[grid.length-1][endY]])
	while (true) {
		var prior = findPrior(pathStack[pathStack.length-1]);
		pathStack.push(prior);
		if (pathStack.filter(function(e) {return (e[0] == 0 && e[1] == startY && e[2] == grid[0][startY])}).length > 0) {
			break;
		}
	}
	return pathStack;
}

function findPrior(node) {
	var x = node[0];
	var y = node[1];
	var dist = node[2];
	console.log(dist);
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (grid[x+i][y+j] == (dist - 1)) {
				return([x+i, y+j, dist-1])
			}
		}
	}
}

function maxNoInfinity(arr) {
	var mx = Math.max.apply(null, arr.filter(function(element) {
		return Math.abs(element) != Infinity
	}));
	return mx;
}

function floodFill(x, y, val, xdim, ydim) {
	fillPixel(x, y, val, xdim, ydim);
	while (Stack.length > 0) {
		var toFill = Stack.pop();
		fillPixel(toFill[0], toFill[1], toFill[2], xdim, ydim);
	}
}

function fillPixel(x, y, val, xdim, ydim) {
	if (!alreadyFilled(x, y, val)) {
		grid[x][y] = val;
	} 

	if (y > 1 && !alreadyFilled(x, y-1, val+1)) Stack.push([x, y-1, val+1]);
	if (x < xdim-1 && !alreadyFilled(x+1, y, val+1)) Stack.push([x+1, y, val+1]);
	if (y < ydim-1 && !alreadyFilled(x, y+1, val+1)) Stack.push([x, y+1, val+1]);
	if (x > 1 && !alreadyFilled(x-1, y, val+1)) Stack.push([x-1, y, val+1]);
}

function alreadyFilled(x, y, val) {
	return (grid[x][y] == -Infinity || grid[x][y] <= val);
}