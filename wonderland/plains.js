function plantFlower(x,y) {
    var background = snowcount < 0 ? randFromArray(PLAINS_GRADIENT) : randFromArray(SNOW_GRADIENT);
    var petal = randFromArray(FLOWER_PETAL);
    createCircle(x,y,randFromArray(FLOWER_CENTER),background);
    createCircle(x-1,y,petal,background);
    createCircle(x+1,y,petal,background);
    createCircle(x,y-1,petal,background);
    createCircle(x,y+1,petal,background);
}

var beasts = [];
function initPlains() {
    beasts = [];
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            grid[i][j] = ENUM_PATH;
            context.fillStyle = snowcount < 0 ? randFromArray(PLAINS_GRADIENT) : randFromArray(SNOW_GRADIENT);
            drawSquare(i, j);
        }
    }
    
    for (var i = grid.length/5; i < grid.length; i += grid.length/5) {
        for (var j = grid.length/5; j < grid.length; j += grid.length/5) {
            console.log(i + " " + j)
            plantFlower(Math.floor(i)+randInt(-grid.length/10,grid.length/10),Math.floor(j)+randInt(-grid.length/10,grid.length/10));
        }
    }

    if (distanceFrom(mapx,mapy,poolx,pooly) > 8 && isWall(mapx, mapy) == "NO") {
        var dirs = ["U","D","L","R"];

        if (Math.random() < 0.6) {
            beasts.push([20,20,randFromArray(dirs)]);
        }
        if (Math.random() < 0.6) {
            beasts.push([60,20,randFromArray(dirs)]);
        }
        if (Math.random() < 0.6) {
            beasts.push([20,60,randFromArray(dirs)]);
        }
        if (Math.random() < 0.6) {
            beasts.push([60,60,randFromArray(dirs)]);
        }

        for (var i=0; i < beasts.length; i++) {
            drawBeast(beasts[i][0], beasts[i][1], beasts[i][2]);
        }
    }
    
    drawPerson(currx,curry);
}

function clearBeast(x,y) {
    for (var i = x-10; i < x+10; i++) {
        for (var j = y-10; j < y+10; j++) {
            if (i >= 0 && j >= 0 && i < grid.length && j < grid.length) {
                if (grid[i][j] != ENUM_PATH) {
                    context.fillStyle = snowcount < 0 ? randFromArray(PLAINS_GRADIENT) : randFromArray(SNOW_GRADIENT);
                    drawSquare(i, j);
                    grid[i][j] = ENUM_PATH;
                }
            }
        }
    }
}

function drawBeast(x, y, dir) {
    var body = "#DAEAEC";
    var mane = "#FFE34D";
    var horn = "#FFFFFF";
    console.log("Beast moved");

    if (dir == "U") {
        context.fillStyle = body;
        for (var i = x-1; i <= x+1; i++) { // Head
            for (var j = y-5; j <= y-2; j++) {
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        for (var i = x-2; i <= x+2; i++){
            for (var j = y-1; j <= y+5; j++) { // Body
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        context.fillStyle = mane;
        for (var j = y-5; j < y; j++) { // Mane
            drawSquare(x, j);
            grid[x][j] = ENUM_BEAST;
        }
        if (Math.random() < 0.5) { // Tail
            for (var i = x; i < x+3; i++) {
                drawSquare(i, y+6);
                grid[i][y+6] = ENUM_BEAST;
            }
        } else {
            for (var i = x-2; i < x+1; i++) {
                drawSquare(i, y+6);
                grid[i][y+6] = ENUM_BEAST;
            }
        }
        context.fillStyle = horn;
        for (var j = y-8; j < y-5; j++) { // Horn
            drawSquare(x, j, true);
            grid[x][j] = ENUM_BEAST;
        }
    } else if (dir == "D") {
        context.fillStyle = body;
        for (var i = x-1; i <= x+1; i++) { // Head
            for (var j = y+2; j <= y+5; j++) {
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        for (var i = x-2; i <= x+2; i++){
            for (var j = y-5; j <= y+1; j++) { // Body
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        context.fillStyle = mane;
        for (var j = y+1; j < y+6; j++) { // Mane
            drawSquare(x, j);
            grid[x][j] = ENUM_BEAST;
        }
        if (Math.random() < 0.5) { // Tail
            for (var i = x; i < x+3; i++) {
                drawSquare(i, y-6);
                grid[i][y-6] = ENUM_BEAST;
            }
        } else {
            for (var i = x-2; i < x+1; i++) {
                drawSquare(i, y-6);
                grid[i][y-6] = ENUM_BEAST;
            }
        }
        context.fillStyle = horn;
        for (var j = y+6; j < y+9; j++) { // Horn
            drawSquare(x, j, true);
            grid[x][j] = ENUM_BEAST;
        }
    } else if (dir == "L") {
        context.fillStyle = body;
        for (var i = x-5; i <= x-2; i++) { // Head
            for (var j = y-1; j <= y+1; j++) {
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        for (var i = x-1; i <= x+5; i++){
            for (var j = y-2; j <= y+2; j++) { // Body
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        context.fillStyle = mane;
        for (var j = x-5; j < x; j++) { // Mane
            drawSquare(j, y);
            grid[j][y] = ENUM_BEAST;
        }
        if (Math.random() < 0.5) { // Tail
            for (var i = y; i < y+3; i++) {
                drawSquare(x+6, i);
                grid[x+6][i] = ENUM_BEAST;
            }
        } else {
            for (var i = y-2; i < y+1; i++) {
                drawSquare(x+6, i);
                grid[x+6][i] = ENUM_BEAST;
            }
        }
        context.fillStyle = horn;
        for (var j = x-8; j < x-5; j++) { // Horn
            drawSquare(j, y, true);
            grid[j][y] = ENUM_BEAST;
        }
    } else if (dir == "R") {
        context.fillStyle = body;
        for (var i = x+2; i <= x+5; i++) { // Head
            for (var j = y-1; j <= y+1; j++) {
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        for (var i = x-5; i <= x+1; i++){
            for (var j = y-2; j <= y+2; j++) { // Body
                drawSquare(i,j);
                grid[i][j] = ENUM_BEAST;
            }
        }
        context.fillStyle = mane;
        for (var j = x+1; j < x+6; j++) { // Mane
            drawSquare(j, y);
            grid[j][y] = ENUM_BEAST;
        }
        if (Math.random() < 0.5) { // Tail
            for (var i = y; i < y+3; i++) {
                drawSquare(x-6, i);
                grid[x-6][i] = ENUM_BEAST;
            }
        } else {
            for (var i = y-2; i < y+1; i++) {
                drawSquare(x-6, i);
                grid[x-6][i] = ENUM_BEAST;
            }
        }
        context.fillStyle = horn;
        for (var j = x+6; j < x+9; j++) { // Horn
            drawSquare(j, y, true);
            grid[j][y] = ENUM_BEAST;
        }
    } else {
        console.log("The beast must face in a cardinal direction.");
    }
}

function moveBeast(nBeast) {
    var xb = beasts[nBeast][0];
    var yb = beasts[nBeast][1];
    var dirs = ["U","D","L","R"];
    var dirMovement = randFromArray(dirs);
    console.log(dirMovement);
    if (dirMovement == "U") {
        if (beastInRange(xb, yb-5) && beastNoOverlap(xb, yb-5, nBeast)) {
            clearBeast(xb,yb);
            drawBeast(xb, yb-5, "U");
            beasts[nBeast] = [xb,yb-5, "U"];
        }
    } else if (dirMovement == "D") {
        if (beastInRange(xb, yb+5) && beastNoOverlap(xb, yb+5, nBeast)) {
            clearBeast(xb,yb);
            drawBeast(xb, yb+5, "D");
            beasts[nBeast] = [xb,yb+5, "D"];
        }
    } else if (dirMovement == "L") {
        if (beastInRange(xb-5, yb) && beastNoOverlap(xb-5, yb, nBeast)) {
            clearBeast(xb,yb);
            drawBeast(xb-5, yb, "L");
            beasts[nBeast] = [xb-5, yb, "L"];
        }
    } else if (dirMovement == "R") {
        if (beastInRange(xb+5, yb) && beastNoOverlap(xb+5, yb, nBeast)) {
            clearBeast(xb,yb);
            drawBeast(xb+5, yb, "R");
            beasts[nBeast] = [xb+5, yb, "R"];
        }
    } else {
        console.log("Invalid movement direction.");
    }
}

function beastInRange(x, y) {
    return (x-8 >= 0 && y-8 >= 0 && x+8 < grid.length && y+8 < grid.length);
}

function beastNoOverlap(x, y, nBeast) {
    for (var i = 0; i < beasts.length; i++) {
        if (i != nBeast) {
            if (distanceFrom(x,y,beasts[i][0],beasts[i][1]) < 25) {
                return false;
            }
        }
    }

    console.log(distanceFrom(x,y,currx*2,curry*2));

    if (distanceFrom(x,y,currx*2,curry*2) < 20) {
        return false;
    }

    return true;
}