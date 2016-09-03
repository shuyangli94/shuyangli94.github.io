function createGrid() {
    var arr = [];
    for (var i=0; i < SIDE_LENGTH / PIXEL; i++) {
        arr[i] = [];
        for (var j=0; j < SIDE_LENGTH / PIXEL; j++) {
            arr[i][j] = 0;
        }
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
    context.fillStyle = leafColor;
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

function distanceFrom(x1,y1,x2,y2) {
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function buildTokyoTower(Tx,Ty,Bx,By) {
    var roofcolor = randFromArray(ROOF_COLORS);
    for (var i=Tx; i < Bx; i++) {
        for (var j=Ty; j < By; j++) {
            grid[i][j] = ENUM_BLOCKED;
            if (i == Tx || i == (Bx-1)) {
                context.fillStyle = WALL_GREY;
                drawSquare(i,j);
            } else if (j == Ty || j == (By-1)) {
                context.fillStyle = WALL_GREY;
                drawSquare(i,j);
            } else {
                context.fillStyle = roofcolor;
                drawSquare(i,j,true);
            }
        }
    }

}

function initTokyo() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            grid[i][j] = ENUM_PATH;
            context.fillStyle = snowcount < 0 ? randFromArray(TOKYOPATH_GRADIENT) : randFromArray(SNOWTOKYOPATH_GRADIENT);
            drawSquare(i, j);
        }
    }


    for (var i = grid.length/16; i < grid.length; i += grid.length*5/16) {
        for (var j = grid.length/16; j < grid.length; j += grid.length*5/16) {
            buildTokyoTower(Math.floor(i), Math.floor(j), Math.floor(i+grid.length/4), Math.floor(j+grid.length/4));
        }
    }

    drawPerson(currx, curry);
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
    if (wonderland) {
        if (mapx == poolx && mapy == pooly) {
            logPane("You open your eyes and climb groggily out of the pool.");
            initPool();
            localeTag = "P";
        } else if (distanceFrom(mapx, mapy, poolx, pooly) <= 3) {
            initTown();
            localeTag = "T";
        } else if (distanceFrom(mapx, mapy, poolx, pooly) <= 6) {
            initForest();
            localeTag = "F";
        } else {
            initPlains();
            localeTag = "L"
        }

        var wall = isWall(mapx, mapy);
        if (wall != "NO") {
            buildWall(wall);
        }
    } else {
        if (mapx == poolx && mapy == pooly) {
            logPane("You open your eyes and climb groggily out of the pool.");
            initPool();
            localeTag = "P";
        } else {
            initTokyo();
            localeTag = "K";
            if (distanceFrom(mapx, mapy, poolx, pooly) > 5) {
                if (mapx == poolx && mapy < pooly) {
                    logPane("<i>Perhaps it would be wise to head South.</i>");
                } else if (mapx == poolx && mapy > pooly) {
                    logPane("<i>Perhaps it would be wise to head North.</i>");
                } else if (mapx < poolx && mapy == pooly) {
                    logPane("<i>Perhaps it would be wise to head East.</i>");
                } else if (mapx > poolx && mapy == pooly) {
                    logPane("<i>Perhaps it would be wise to head West.</i>");
                } else if (mapx < poolx && mapy < pooly) {
                    logPane("<i>Perhaps it would be wise to head Southeast.</i>");
                } else if (mapx < poolx && mapy > pooly) {
                    logPane("<i>Perhaps it would be wise to head Northeast.</i>");
                } else if (mapx > poolx && mapy < pooly) {
                    logPane("<i>Perhaps it would be wise to head Southwest.</i>");
                } else if (mapx > poolx && mapy > pooly) {
                    logPane("<i>Perhaps it would be wise to head Northwest.</i>");
                } else {
                    console.log("THIS SHOULDN'T BE HAPPENING");
                }
            }
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
    weatherMachine();
    wonderland = true;
    var arbmarg = 5;
    curry = randInt(arbmarg,(40-arbmarg));
    console.log("Start at (" + currx + "," + curry + ")");
    mapx = poolx;
    mapy = pooly;
    localeTag = "P";
    beasts = [];
    moveScreen();
}

initialize(context, canvas);