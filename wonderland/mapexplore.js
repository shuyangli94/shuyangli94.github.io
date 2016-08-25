function createGrid() {
    var arr = [];
    for (var i=0; i < SIDE_LENGTH / PIXEL; i++) {
        arr[i] = [];
        for (var j=0; j < SIDE_LENGTH / PIXEL; j++) {
            arr[i][j] = 0;
        }
    }
    if (snowcount == -1) {
        logPane("The sun slips away to its hibernation. The snow falls once again.");
        snowcount += 6;
    } else if (snowcount < 0) {
        map[mapx][mapy] == "F" ? logPane(sunMessages_forest[snowcount+5]) : logPane(sunMessages_town[snowcount+5]);
        snowcount += 1;
    } else if (snowcount == 1) {
        logPane("You shake the last of the snow from your coat. The sun has emerged.")
        snowcount -= 6;
    } else if (snowcount > 0) {
        map[mapx][mapy] == "F" ? logPane(snowMessages_forest[-snowcount+5]) : logPane(snowMessages_town[-snowcount+5]);
        snowcount -= 1;
    } else {
        console.log("START");
        snowcount -= 5;
    }

    return arr;
}

function createCircle(gridx, gridy, leafColor, trunkColor) {
    context.fillStyle = TREE_BROWNS[trunkColor];
    drawSquare(gridx, gridy);
    // context.fillRect(gridx*PIXEL, gridy*PIXEL, PIXEL, PIXEL);
    context.beginPath();
    context.arc(gridx*PIXEL+PIXEL/2, gridy*PIXEL+PIXEL/2, PIXEL/2, 0, 2*Math.PI, true);
    context.closePath();
    context.fillStyle = GREEN_GRADIENT[leafColor];
    context.fill();
}

function drawPathTile(x, y, rad) {
    var p = rad;
    for (var i=-p; i < p+1; i++) {
        for (var j=-p; j < p+1; j++) {
            if (x >= -i && x < grid.length - i && y >= -j && y <= grid.length - j) {
                grid[x+i][y+j] = ENUM_PATH;
                context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
                drawSquare(x+i, y+j);
                // context.fillRect((x+i)*PIXEL,(y+j)*PIXEL,PIXEL,PIXEL);
            }
           
        }
    }
}

function drawStraightPath(Sx, Sy, Ex, Ey, rad) {
    if (Sx == Ex) { // Vertical path
        for (var i = Math.max(0,Sx-rad); i < Math.min(Sx+rad+1,grid.length); i++) {
            for (var j = Sy; j < Ey; j++) {
                grid[i][j] = ENUM_PATH;
                context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
                drawSquare(i, j);
            }
        }
    } else if (Sy == Ey) {
        for (var j = Math.max(0,Sy-rad); j < Math.min(grid.length,Sy+rad+1); j++) {
            for (var i = Sx; i < Ex; i++) {
                grid[i][j] = ENUM_PATH;
                context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
                drawSquare(i, j);
            }
        }
    } else {
        console.log("Not an H/V path");
    }
}

function isWall(map_x, map_y) {
    if (map_x == 0 && map_y == 0) {
        return "UL";
    } else if (map_x==0 && map_y==15) {
        return "DL";
    } else if (map_x==19 && map_y==0) {
        return "UR";
    } else if (map_x==19 && map_y==15) {
        return "DR";
    } else if (map_x==0) {
        return "L";
    } else if (map_x==19) {
        return "R";
    } else if (map_y==0) {
        return "U";
    } else if (map_y==15) {
        return "D";
    } else {
        return "NO";
    }
}

function tileWall(x, y) {
    var p = 2;
    for (var i=-p; i < p+1; i++) {
        for (var j=-p; j < p+1; j++) {
            if (x >= -i && x < grid.length - i && y >= -j && y <= grid.length - j) {
                grid[x+i][y+j] = ENUM_WALL;
                context.fillStyle = randFromArray(WALL_GRADIENT);
                drawSquare(x+i, y+j);
                // context.fillRect((x+i)*PIXEL,(y+j)*PIXEL,PIXEL,PIXEL);
            }
           
        }
    }
}

function buildWall(loc) {
    var w = grid.length/4;
    if (loc == "UL") {
        for (var y = w/4; y < grid.length; y++) {
            tileWall(w/4, y);
        }
        for (var x = w/4; x < grid.length; x++) {
            tileWall(x, w/4);
        }
    } else if (loc == "DL") {
        for (var y = 0; y < 3*w/4; y++) {
            tileWall(3*w/4, y);
        }
        for (var x = 0; x < 3*w/4; x++) {
            tileWall(x, 3*w/4);
        }
    } else if (loc == "UR") {
        for (var y = w/4; y < grid.length; y++) {
            tileWall(3*w/4, y);
        }
        for (var x = 0; x < 3*w/4; x++) {
            tileWall(x, w/4);
        }
    } else if (loc == "DR") {
        for (var y = 0; y < 3*w/4; y++) {
            tileWall(3*w/4, y);
        }
        for (var x = 0; x < 3*w/4; x++) {
            tileWall(x, 3*w/4);
        }
    } else if (loc == "L") {
        for (var y = 0; y < grid.length; y++) {
            tileWall(w/4, y);
        }
    } else if (loc == "R") {
        for (var y = 0; y < grid.length; y++) {
            tileWall(3*w/4, y);
        }
    } else if (loc == "D") {
        for (var x = 0; x < grid.length; x++) {
            tileWall(x, 3*w/4);
        }
    } else if (loc == "U") {
        for (var x = 0; x < grid.length; x++) {
            tileWall(x, w/4);
        }
    }  
}

function initialize(context, canvas) {
    canvas.addEventListener("keydown", checkKey, false);
    document.getElementById("log").innerHTML = '';
    for (var i=0; i<5; i++) {
        document.getElementById("log").innerHTML += ('<label id="log' + i + '" style="font-weight:normal;color:' + logColors[i] + '"></label><br />');
    }
    currx = 0;
    var arbmarg = 5;
    curry = randInt(arbmarg,(40-arbmarg));
    console.log("Start at (" + currx + "," + curry + ")");
    mapx = 9;
    mapy = 8;
    moveScreen();
}

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
            // switch (randInt(0,2)) {
            //     case 0: plantTrees(plot[0],plot[1],plot[2],plot[3]); break;
            //     case 1: buildHouse(plot[0],plot[1],plot[2],plot[3]); break;
            // }
        }
    }

    drawPerson(currx,curry);
}

function logPane(message) {
    if (message != "") {
        for (var i=0; i<4; i++) {
            document.getElementById("log" + i).innerHTML = document.getElementById("log"+(i+1)).innerHTML;
        }
        document.getElementById("log4").innerHTML = message;
    }   
}

function moveScreen() {
    grid = createGrid();
    if (map[mapx][mapy] == "F") {
        initForest();
    } else if (map[mapx][mapy] == "T") {
        initTown();
    }    
    var wall = isWall(mapx, mapy);
    if (wall != "NO") {
        buildWall(wall);
    }
}

initialize(context, canvas);