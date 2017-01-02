var Stack = [];
var grid;
var enum_FILLED = 2017;

function floodFill(x, y, val, xdim, ydim) {
	fillPixel(x, y, val, xdim, ydim);
	while (Stack.length > 0) {
		var toFill = Stack.pop();
		fillPixel(toFill[0], toFill[1], val, xdim, ydim);
	}
}

function fillPixel(x, y, val, xdim, ydim) {
	if (!alreadyFilled(x, y, val)) {
		grid[x][y] = val;
	} 

	if (y > 1 && !alreadyFilled(x, y-1, val)) Stack.push([x, y-1]);
	if (x < xdim-1 && !alreadyFilled(x+1, y, val)) Stack.push([x+1, y]);
	if (y < ydim-1 && !alreadyFilled(x, y+1, val)) Stack.push([x, y+1]);
	if (x > 1 && !alreadyFilled(x-1, y, val)) Stack.push([x-1, y]);
}

function alreadyFilled(x, y, val) {
	return (grid[x][y] == 0 || grid[x][y] == val);
}