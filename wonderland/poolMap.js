function drawPool() {
    for (var i=0; i < grid.length; i++) {
        for (var j=0; j < grid.length; j++) {
            if (distanceFrom(i,j,40,40) < 15) {
                context.fillStyle = randFromArray(POOL1_GRADIENT);
                drawSquare(i,j);
                grid[i][j] = ENUM_POOL;
            } else if ((distanceFrom(i,j,40,40) < 22)) {
                context.fillStyle = randFromArray(POOL2_GRADIENT);
                drawSquare(i,j);
                grid[i][j] = ENUM_POOL;
            } else if ((distanceFrom(i,j,40,40) < 28)) {
                context.fillStyle = randFromArray(POOL3_GRADIENT);
                drawSquare(i,j);
                grid[i][j] = ENUM_POOL;
            } else {
                // Draw nothing over the background
            }
        }
    }
}

function drawPoolOuter() {
    for (var i=0; i < grid.length; i++) {
        for (var j=0; j < grid.length; j++) {
            if ((distanceFrom(i,j,40,40) < 30)) {
                context.fillStyle = Math.random() < 0.93 ? randFromArray(POOL3_GRADIENT) : (wonderland ? randFromArray(PATH_GRADIENT) : randFromArray(TOKYOPATH_GRADIENT));
                drawSquare(i,j);
                grid[i][j] = ENUM_POOL;
            } else if ((distanceFrom(i,j,40,40) < 31)) {
                context.fillStyle = Math.random() < 0.7 ? randFromArray(POOL3_GRADIENT) : (wonderland ? randFromArray(PATH_GRADIENT) : randFromArray(TOKYOPATH_GRADIENT));
                drawSquare(i,j);
                grid[i][j] = ENUM_POOL;
            } else {
                // Draw nothing over background
            }
        }
    }
}

function initPool() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            grid[i][j] = ENUM_PATH;
            if (!wonderland) {
                context.fillStyle = snowcount < 0 ? randFromArray(TOKYOPATH_GRADIENT) : randFromArray(SNOWTOKYOPATH_GRADIENT);
            } else {
                context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
            }
            drawSquare(i, j);
        }
    }

    drawPoolOuter();
    drawPool();
    drawPerson(currx,curry);
}