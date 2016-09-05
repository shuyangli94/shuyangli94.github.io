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
                if (grid[x+i][y+j] != ENUM_PATH) {
                    grid[x+i][y+j] = ENUM_PATH;
                    context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
                    drawSquare(x+i, y+j);
                }
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
            if (Math.random() < 0.7) {
                buildTokyoTower(Math.floor(i), Math.floor(j), Math.floor(i+grid.length/4), Math.floor(j+grid.length/4));
            } else {
                plantTrees(Math.floor(i), Math.floor(j), Math.floor(i+grid.length/4), Math.floor(j+grid.length/4));
            }
            
        }
    }

    drawPerson(currx, curry);
}

function drawLibraryCore() {
    context.fillStyle = WALL_GREY;
    context.fillRect(30*PIXEL, 6*PIXEL, 20*PIXEL, 68*PIXEL);
    context.fillRect(6*PIXEL, 30*PIXEL, 68*PIXEL, 20*PIXEL);
    for (var x=30; x <= 50; x++) {
        for (var y=6; y<=72; y++) {
            grid[x][y] = ENUM_BLOCKED;
        }
    }
    for (var x=6; x <= 72; x++) {
        for (var y=30; y<=50; y++) {
            grid[x][y] = ENUM_BLOCKED;
        }
    }

    // Doors
    context.fillStyle = "#A5614A";
    for (var x=35; x < 45; x++) {
        for (var y=6; y <= 7; y++) {
            grid[x][y] = ENUM_LIBRARY;
            drawSquare(x,y);
        }
    }
    for (var x=35; x < 45; x++) {
        for (var y=72; y <= 73; y++) {
            grid[x][y] = ENUM_LIBRARY;
            drawSquare(x,y);
        }
    }
    for (var x=6; x <= 7; x++) {
        for (var y=35; y < 45; y++) {
            grid[x][y] = ENUM_LIBRARY;
            drawSquare(x,y);
        }
    }
    for (var x=72; x <= 73; x++) {
        for (var y=35; y < 45; y++) {
            grid[x][y] = ENUM_LIBRARY;
            drawSquare(x,y);
        }
    }
}

function drawLibraryRoof() {
    for (var x=12; x <= 68; x++) {
        for (var y=12; y <= 68; y++) {
            var df = distanceFrom(x,y,40,40);
            if ( df <= 8.8) {
                console.log(Math.floor(df));
                context.fillStyle = LIBRARY3[Math.floor(df)];
                drawSquare(x,y);
                grid[x][y] = ENUM_BLOCKED;
            } else if (df <= 17.8) {
                context.fillStyle = LIBRARY2[Math.floor(df)-9];
                drawSquare(x,y);
                grid[x][y] = ENUM_BLOCKED;
            } else if (df <= 26.8) {
                context.fillStyle = LIBRARY1[Math.floor(df)-18];
                drawSquare(x,y);
                grid[x][y] = ENUM_BLOCKED;
            }
        }
    }
}

function initLibrary() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            grid[i][j] = ENUM_PATH;
            context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
            drawSquare(i, j);
        }
    }

    drawLibraryCore();
    drawLibraryRoof();
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
        } else if (mapx == libraryx && mapy == libraryy) {
            logPane("Here is the library, where you work as a Dream Reader.");
            initLibrary();
            localeTag = "B";
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