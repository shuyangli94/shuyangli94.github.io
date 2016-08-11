var Stack = [];
var enum_COOKIE = 0;
var enum_CHOC = -1;
var enum_CRACK = 1;

function floodFill(x, y, val) {
	fillPixel(x, y, val);
	while (Stack.length > 0) {
		var toFill = Stack.pop();
		fillPixel(toFill[0], toFill[1], val);
	}
}

function fillPixel(x, y, val) {
	if (!alreadyFilled(x, y, val)) {
		fill(x, y, val);
		area_left -= 1;
	} 

	if (y > 1 && !alreadyFilled(x, y-1, val)) Stack.push([x, y-1]);
	if (x < COOKIE_WIDTH-1 && !alreadyFilled(x+1, y, val)) Stack.push([x+1, y]);
	if (y < COOKIE_WIDTH-1 && !alreadyFilled(x, y+1, val)) Stack.push([x, y+1]);
	if (x > 1 && !alreadyFilled(x-1, y, val)) Stack.push([x-1, y]);
}

function fill(x, y, val) {
	grid[x][y] = val;
	context.fillStyle = "#fff";
	context.fillRect(x,y,1,1);
}

function alreadyFilled(x, y, val) {
	// return (grid[x][y] == enum_CRACK || grid[x][y] == enum_CHOC || grid[x][y] == val);
	return (grid[x][y] == enum_CRACK || grid[x][y] == val);
}