function partitionTown() {
    if (currx == 0 || currx == grid.length/2-1) { // First path LR
        // for (var i=0; i<grid.length; i++) {
        //     drawPathTile(i, curry*2, PATH_RADIUS);
        // }
        drawStraightPath(0,curry*2,grid.length,curry*2,PATH_RADIUS);
        if (curry*2 < grid.length / 4) {
            subPartition(0, curry*2+PATH_RADIUS, grid.length, grid.length, 1);
        } else if (curry*2 > grid.length*3/4) {
            subPartition(0, 0, grid.length-1, curry*2-PATH_RADIUS, 1);
        } else {
            subPartition(0, 0, grid.length-1, curry*2-PATH_RADIUS, 1);
            subPartition(0, curry*2+PATH_RADIUS, grid.length, grid.length, 1);
        }
    } else if (curry == 0 || curry == grid.length/2-1) { // first path UD
        // for (var j=0; j<grid.length; j++) {
        //     drawPathTile(currx*2, j, PATH_RADIUS);
        // }
        drawStraightPath(currx*2,0,currx*2,grid.length,PATH_RADIUS);
        if (currx*2 < grid.length / 4) {
            subPartition(currx*2+PATH_RADIUS, 0, grid.length, grid.length, 1);
        } else if (currx*2 > grid.length*3/4) {
            subPartition(0, 0, currx*2-PATH_RADIUS, grid.length, 1);
        } else {
            subPartition(0, 0, currx*2-PATH_RADIUS, grid.length, 1);
            subPartition(currx*2+PATH_RADIUS, 0, grid.length, grid.length, 1);
        }
    } else {
        console.log("ERROR. This shouldn't happen...");
    }
    return;
}

function subPartition(Tx, Ty, Bx, By, stackn) {
    var width = Math.abs(Bx-Tx);
    var height = Math.abs(By-Ty);
    if (stackn > 2) {
        landPlots.push([Tx, Ty, Bx, By]);
        return;
    }
    if (width*height < grid.length*grid.length / 6) {
        landPlots.push([Tx, Ty, Bx, By]);
        return;
    } else if (Math.min(width,height) < grid.length / 3) {
        landPlots.push([Tx, Ty, Bx, By]);
        return;
    } else if (Math.max(width,height) < grid.length / 2) {
        landPlots.push([Tx, Ty, Bx, By]);
        return;
    }

    if (width >= height) { // Partition U-D
        var parX = randInt(Math.floor(width/3), Math.floor(2*width/3)) + Tx;
        drawStraightPath(parX,Ty,parX,By,PATH_RADIUS-2);
        subPartition(Tx, Ty, parX-PATH_RADIUS+2, By, stackn+1);
        subPartition(parX+PATH_RADIUS-2, Ty, Bx, By, stackn+1);
    } else { // Partition R-L
        var parY = randInt(Math.floor(height/3), Math.floor(2*height/3)) + Ty;
        drawStraightPath(Tx,parY,Bx,parY,PATH_RADIUS-2);
        for (var i=0; i<width; i++) {
            drawPathTile(Tx+i, parY, PATH_RADIUS-2);
        }
        subPartition(Tx, Ty, Bx, parY-PATH_RADIUS+2, stackn+1);
        subPartition(Tx, parY+PATH_RADIUS-2, Bx, By, stackn+1);
    }
    return;
}

function plantTrees(Tx, Ty, Bx, By) {
    console.log("From (" + Tx + "," + Ty + ") to (" + Bx + "," + By + ")");
    var max_Tree = 10;
    for (var i = 0; i < (Bx-Tx - max_Tree/3)/max_Tree/2; i++) {
        for (var j = 0; j < (By-Ty - max_Tree/3)/max_Tree/2; j++) {
            var xs = [Math.floor((Tx+Bx)/2) + Math.floor(i * max_Tree * 0.9), Math.floor((Tx+Bx)/2) - Math.floor(i * max_Tree * 0.9)];
            var ys = [Math.floor((Ty+By)/2) + Math.floor(j * max_Tree * 0.9), Math.floor((Ty+By)/2) - Math.floor(j * max_Tree * 0.9)];
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < 2; y++) {
                    var rad = Math.floor(Math.random()*3) + 2;
                    createTree(xs[x],ys[y],rad);
                    if (rad > 3) {
                        createTree(xs[x],ys[y],rad-2);
                    }
                    if (rad > 2) {
                        createTree(xs[x],ys[y],rad-1);
                    }
                }
            }
            
        }
    }
}

function buildHouse(Tx, Ty, Bx, By) {
    var wall_thick = 2;
    var lawn_thick = 3;
    for (var i=Tx; i<Bx; i++) {
        for (var j=Ty; j<By; j++) {
            grid[i][j] = ENUM_PATH;
            context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOW_GRADIENT);
            drawSquare(i,j);
        }
    }
    for (var i=Tx+lawn_thick; i<Bx-lawn_thick; i++) {
        for (var j=Ty+lawn_thick; j<By-lawn_thick; j++) {
            grid[i][j] = ENUM_BLOCKED;
            context.fillStyle = WALL_GREY;
            drawSquare(i,j);
        }
    }
    for (var i=Tx+lawn_thick+wall_thick; i<Bx-lawn_thick-wall_thick; i++) {
        for (var j=Ty+lawn_thick+wall_thick; j<By-lawn_thick-wall_thick; j++) {
            grid[i][j] = ENUM_BLOCKED;
            context.fillStyle = snowcount < 0 ? randFromArray(ROOF_GRADIENT_RED) : randFromArray(SNOWROOF_GRADIENT_RED);
            drawSquare(i,j, true);
        }
    }

    // Doors
    context.fillStyle = "#A5614A";
    var midx = Math.floor((Bx+Tx)/2);
    var midy = Math.floor((By+Ty)/2);
    for (var i = midx; i < midx+4; i++) {
        for (var j = Ty+lawn_thick; j < Ty+lawn_thick+2; j++) {
            grid[i][j] = ENUM_BLDG;
            drawSquare(i,j);
        }
    }
    for (var i = midx; i < midx+4; i++) {
        for (var j = By-lawn_thick-2; j < By-lawn_thick; j++) {
            grid[i][j] = ENUM_BLDG;
            drawSquare(i,j);
        }
    }
    for (var i = Tx+lawn_thick; i < Tx+lawn_thick+2; i++) {
        for (var j = midy; j < midy+4; j++) {
            grid[i][j] = ENUM_BLDG;
            drawSquare(i,j);
        }
    }
    for (var i = Bx-lawn_thick-2; i < Bx-lawn_thick; i++) {
        for (var j = midy; j < midy+4; j++) {
            grid[i][j] = ENUM_BLDG;
            drawSquare(i,j);
        }
    }
}

function initTown() {
    landPlots = undefined;
    landPlots = [];
    var floor_tile = PIXEL*2;
    for (var i=0; i < SIDE_LENGTH; i+= floor_tile) {
        for (var j=0; j < SIDE_LENGTH; j+= floor_tile) {
            context.fillStyle = snowcount < 0 ? randFromArray(GRASS_GRADIENT) : randFromArray(SNOW_GRADIENT);
            context.fillRect(i,j,floor_tile,floor_tile);
        }
    }
    for (var i=0; i < grid.length; i++) {
        for (var j=0; j<grid.length; j++) {
            grid[i][j] = 0;
        }
    }
    partitionTown();
    for (var i = 0; i < landPlots.length; i++) {
        var plot = landPlots[i];
        if (Math.min(plot[2]-plot[0],plot[3]-plot[1]) < grid.length/4) {
            plantTrees(plot[0],plot[1],plot[2],plot[3]);
        } else {
            buildHouse(plot[0],plot[1],plot[2],plot[3]);
        }
    }

    drawPerson(currx,curry);
}