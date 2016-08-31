function plantFlower(x,y) {
    var background = snowcount < 0 ? randFromArray(PLAINS_GRADIENT) : randFromArray(SNOW_GRADIENT);
    var petal = randFromArray(FLOWER_PETAL);
    createCircle(x,y,randFromArray(FLOWER_CENTER),background);
    createCircle(x-1,y,petal,background);
    createCircle(x+1,y,petal,background);
    createCircle(x,y-1,petal,background);
    createCircle(x,y+1,petal,background);
}

function initPlains() {
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
    
    drawPerson(currx,curry);
}