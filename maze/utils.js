var minr = 50;
var maxr = 150;

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

setDimensionConstraints(50, 100);

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