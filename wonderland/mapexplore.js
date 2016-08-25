var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var SIDE_LENGTH = canvas.width;
var PIXEL = 8;
var mapx = 0;
var mapy = 0;
var map = [["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
        ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"]];

function randInt(min, max) {
    return (Math.floor(Math.random()*(max-min)) + min);
}

function randFromArray(targetArray) {
    return (targetArray[Math.floor(Math.random() * targetArray.length)]);
}

function drawSquare(x, y) {
    context.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
}

// Tim Down (http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb)
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Tim Down (http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb)
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateGradient(startHex, endHex, steps) {
    var endR = hexToRgb(endHex);
    var startR = hexToRgb(startHex);
    var gradarray = [];
    for (var i=0; i<steps+1; i++) {
        var eR = Math.floor((endR.r-startR.r)*(i/steps)+startR.r);
        var eG = Math.floor((endR.g-startR.g)*(i/steps)+startR.g);
        var eB = Math.floor((endR.b-startR.b)*(i/steps)+startR.b);
        gradarray[i] = rgbToHex(eR, eG, eB);
    }
    return gradarray;
}

// var GREEN_GRADIENT = ["#1A4721","#285326","#365F2C","#456B32","#537738","#61833E","#708F44","#7E9B4A","#8CA750","#9BB356","#A9BF5C","#B8CB62"];
var GREEN_GRADIENT = generateGradient("#1A4721","#B8CB62",13);
var TREE_BROWNS = generateGradient("#1F4116","#2C4F27",4);
// var TREE_BROWNS = ["#855E4C","#4E3727","#622A17","#421011"];
var PATH_GRADIENT = generateGradient("#737373","#8F8F8F",4);
// var PATH_GRADIENT = ["#7D7D7D","868686","#8F8F8F","#989898","#A1A1A1"];
var FLOOR_GRADIENT = generateGradient("#6C4C41","#715347",6);
var SNOW_GRADIENT = generateGradient("#ECE2DF","#FFFFFF",8);
var ROOF_GRADIENT_RED = generateGradient("#C65858","#822626", 22);
var SNOWROOF_GRADIENT_RED = generateGradient("#D58686","#CB4343", 22);
var ROOF_GRADIENT_BLUE = generateGradient("#5864C6","#263F82", 22);
var SNOWROOF_GRADIENT_BLUE = generateGradient("#869CD5","#4369CB", 22);
var ROOF_GRADIENT_GREEN = generateGradient("#58C664","#268228", 22);
var SNOWROOF_GRADIENT_GREEN = generateGradient("#86D596","#43CB4D", 22);
var ROOF_GRADIENT_YELLOW = generateGradient("#C6A558","#826526", 22);
var SNOWROOF_GRADIENT_YELLOW = generateGradient("#D5C386","#CBA743", 22);

var ROOFS = [ROOF_GRADIENT_RED, ROOF_GRADIENT_BLUE, ROOF_GRADIENT_GREEN, ROOF_GRADIENT_YELLOW];
var SNOWROOFS = [SNOWROOF_GRADIENT_RED, SNOWROOF_GRADIENT_BLUE, SNOWROOF_GRADIENT_GREEN, SNOWROOF_GRADIENT_YELLOW];
var SNOWPATH_GRADIENT = generateGradient("9A9A9A", "BCBCBC", 4);
var WALL_GRADIENT = generateGradient("#FFD700", "#FFE975",5);
// var FLOOR_GRADIENT = ["#A5A762","#CCCB99","#74664E"];
var logColors = generateGradient("#A8A8A8","#000000",4);
var snowMessages_forest = ["The snowflakes seem to avoid the trees. You follow their example.",
    "",
    "You clutch close the Colonel's walking stick and soldier onwards.",
    "<i>You wonder what it would be like to live in a world without sound.</i>"];
var sunMessages_forest = ["The Gatekeeper warned you not to wander the woods alone.",
    "<i>The woods-dwellers have no place in town, nor outside of the Wall</i>",
    "",
    "<i>The golden Wall seems to stare at you through the frosty air.</i>"];
var snowMessages_town = ["The snow has fallen too thick for any townspeople to work.",
    "",
    "Your contemplate ducking inside somebody's home to warm up.",
    "<i>You wonder what it would be like to live in a world without sound.</i>"];
var sunMessages_town = ["In the distance, you hear the Gatekeeper's horn.",
    "You stop and stare at the roofs glittering in the sun.",
    "",
    "<i>Sometimes you wonder what would happen if the Wall fell.</i>"];
var WALL_GREY = "#333333";

var ENUM_TREE = -1;
var ENUM_PATH = 1;
var ENUM_PERSON = 111;
var ENUM_WALL = -999;
var ENUM_BLOCKED = -2;

var snowcount = 0;

var grid = [];
var currx = 0;
var curry = 0;

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

function createTree(center_x, center_y, radius) {
    var centerbase = GREEN_GRADIENT.length - Math.floor(Math.random() * 5) - 1;
    var trunkcolor = Math.floor(Math.random() * TREE_BROWNS.length);
    for (var i=(-1*radius); i < radius+1; i++) {
        for (var j=(-1*radius); j < radius+1; j++) {
            // console.log(i + " " + j);
            if (radius > 2) {
                if (!(Math.abs(i) == radius && Math.abs(j) == radius) && !(Math.abs(i) == radius && Math.abs(j) == radius-1) && !(Math.abs(i) == radius-1 && Math.abs(j) == radius)) {
                    if (radius * 2 + centerbase >= GREEN_GRADIENT.length) {
                        var leafColor = Math.max(Math.abs(i),Math.abs(j))*-2 + centerbase;
                    } else {
                        var leafColor = Math.max(Math.abs(i),Math.abs(j))*-3 + centerbase;
                    }
                    
                    if (center_x >= -i && center_x < grid.length - i && center_y >= -j && center_y <= grid.length - j) {
                        createCircle(center_x + i, center_y + j, leafColor, trunkcolor);
                        grid[center_x + i][center_y + j] = ENUM_TREE;
                    }
                }
            } else {
                if (!(Math.abs(i) == radius && Math.abs(j) == radius)) {
                    if (radius * 2 + centerbase >= GREEN_GRADIENT.length) {
                        var leafColor = Math.max(Math.abs(i),Math.abs(j))*-2 + centerbase;
                    } else {
                        var leafColor = Math.max(Math.abs(i),Math.abs(j))*-3 + centerbase;
                    }
                    
                    if (center_x >= -i && center_x < grid.length - i && center_y >= -j && center_y <= grid.length - j) {
                        createCircle(center_x + i, center_y + j, leafColor, trunkcolor);
                        grid[center_x + i][center_y + j] = ENUM_TREE;
                    }
                }
            }
        }
    }
}

function populateTrees() {
    var g = 10;
    for (var i = 0; i < grid.length / g; i++) {
        for (var j = 0; j < grid.length / g; j++) {
            var x = Math.floor(Math.random()*g) + i * g;
            var y = Math.floor(Math.random()*g) + j * g;
            if (grid[x][y] != ENUM_PATH) {
                var rad = Math.floor(Math.random()*3) + 3;
                createTree(x,y,rad);
                if (rad > 3) {
                    createTree(x,y,rad-2);
                }
                if (rad > 2) {
                    createTree(x,y,rad-1);
                }
            }
        }
    }

}

function drawPerson(x,y) {
    context.fillStyle = "#F2722C";
    context.fillRect(x*PIXEL*2, y*PIXEL*2, PIXEL*2, PIXEL*2);
    context.beginPath();
    context.arc(x*PIXEL*2+PIXEL, y*PIXEL*2+PIXEL, PIXEL/1.5, 0, 2*Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
}

function drawPath(startx, starty) {
    var end = getEnd(startx, starty);
    var endx = end[0];
    var endy = end[1];
    var cx = startx;
    var cy = starty;
    console.log("Path from (" + startx + "," + starty + ") to (" + endx + "," + endy + ")");
    var mid = SIDE_LENGTH / PIXEL / 2;

    // First draw path to midpoint
    while (cx != mid || cy != mid) {
        console.log("At (" + cx + "," + cy + ")");
        if (cx == mid) {
            (cy < mid) ? cy += 1 : cy -= 1;
        } else if (cy == mid) {
            (cx < mid) ? cx += 1 : cx -= 1;
        } else {
            if (Math.random() < 0.5) {
                (cx < mid) ? cx += 1 : cx -= 1;
            } else {
                (cy < mid) ? cy += 1 : cy -= 1;
            }
        }
        drawPathTile(cx,cy);
    }


    // Then draw path from midpoint to end
    while (cx != endx || cy != endy) {
        if (cx == endx) {
            (cy < endy) ? cy += 1 : cy -= 1;
        } else if (cy == endy) {
            (cx < endx) ? cx += 1 : cx -= 1;
        } else {
            if (Math.random() < 0.5) {
                (cx < endx) ? cx += 1 : cx -= 1;
            } else {
                (cy < endy) ? cy += 1 : cy -= 1;
            }
        }
        drawPathTile(cx,cy);
    }
}

function drawPathTile(x, y) {
    var p = 7;
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

function getEnd(startx, starty) {
    var endx = 0;
    var endy = 0;
    var endregion = Math.floor(Math.random() * 6);
    if (startx < grid.length / 2) {
        if (starty < grid.length / 2) { // upper left
            if (Math.random() < 0.5) {
                endx = grid.length - 1;
                endy = Math.floor(Math.random() * (grid.length*3/4)) + Math.floor(grid.length/4);
            } else {
                endy = grid.length - 1;
                endx = Math.floor(Math.random() * (grid.length*3/4)) + Math.floor(grid.length/4);
            }
        } else { // lower left
            if (Math.random() < 0.5) {
                endx = grid.length - 1;
                endy = Math.floor(Math.random() * (grid.length*3/4));
            } else {
                endy = 0;
                endx = Math.floor(Math.random() * (grid.length*3/4)) + Math.floor(grid.length/4);
            }
        }
    } else {
        if (starty < grid.length / 2) { // upper right
            if (Math.random() < 0.5) {
                endx = 0;
                endy = Math.floor(Math.random() * (grid.length*3/4)) + Math.floor(grid.length/4);
            } else {
                endy = grid.length - 1;
                endx = Math.floor(Math.random() * (grid.length*3/4));
            }
        } else { // lower right
            if (Math.random() < 0.5) {
                endx = 0;
                endy = Math.floor(Math.random() * (grid.length*3/4));
            } else {
                endy = 0;
                endx = Math.floor(Math.random() * (grid.length*3/4));
            }
        }

    }

    return [endx, endy];
}

function replacePath(i, j) {
    grid[i][j] = ENUM_PATH;
    context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
    drawSquare(i, j);
}

function checkKey(e) {
    e.preventDefault();
    e = e || window.event;

    if (e.keyCode == '38') { // UP
        console.log("Move up");
        if (curry == 0) {
            console.log("Exit upwards");
            curry = grid.length/2 - 1;
            mapy -= 1;
            moveScreen();
            return;
            // Exit upwards
        } else {
            if (grid[currx*2][(curry-1)*2] != ENUM_PATH || grid[currx*2][(curry-1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry-1)*2] != ENUM_PATH || grid[currx*2+1][(curry-1)*2+1] != ENUM_PATH) { // Wrong
            } else {
                curry -= 1;
                drawPerson(currx, curry);
                for (var i = currx*2; i <= currx*2+1; i++) {
                    for (var j=curry*2+2; j <= curry*2+3; j++) {
                        replacePath(i,j)
                    }
                }
            }
        }
    }
    else if (e.keyCode == '40') { // DOWN
        console.log("Move down");
        if (curry == grid.length/2 - 1) {
            console.log("Exit downwards");
            curry = 0;
            mapy += 1;
            moveScreen();
            return;
            // Exit upwards
        } else {
            if (grid[currx*2][(curry+1)*2] != ENUM_PATH || grid[currx*2][(curry+1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry+1)*2] != ENUM_PATH || grid[currx*2+1][(curry+1)*2+1] != ENUM_PATH) { // Wrong
            } else {
                curry += 1;
                drawPerson(currx, curry);
                for (var i = currx*2; i <= currx*2+1; i++) {
                    for (var j=curry*2-2; j <= curry*2-1; j++) {
                        replacePath(i,j)
                    }
                }
            }
        }
    }
    else if (e.keyCode == '37') { // LEFT
        console.log("Move left");
        if (currx == 0) {
            console.log("Exit leftwards");
            currx = grid.length/2 - 1;
            mapx -= 1;
            moveScreen();
            return;
            // Exit upwards
        } else {
            if (grid[(currx-1)*2][curry*2] != ENUM_PATH || grid[(currx-1)*2+1][curry*2] != ENUM_PATH || grid[(currx-1)*2][curry*2+1] != ENUM_PATH || grid[(currx-1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
            } else {
                currx -= 1;
                drawPerson(currx, curry);
                for (var i = currx*2+2; i <= currx*2+3; i++) {
                    for (var j=curry*2; j <= curry*2+1; j++) {
                        replacePath(i,j)
                    }
                }
            }
        }
    }
    else if (e.keyCode == '39') { // RIGHT
       console.log("Move right");
        if (currx == grid.length/2-1) {
            console.log("Exit rightwards");
            currx = 0;
            mapx += 1;
            moveScreen();
            return;
            // Exit upwards
        } else {
            if (grid[(currx+1)*2][curry*2] != ENUM_PATH || grid[(currx+1)*2+1][curry*2] != ENUM_PATH || grid[(currx+1)*2][curry*2+1] != ENUM_PATH || grid[(currx+1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
            } else {
                currx += 1;
                drawPerson(currx, curry);
                for (var i = currx*2-2; i <= currx*2-1; i++) {
                    for (var j=curry*2; j <= curry*2+1; j++) {
                        replacePath(i,j)
                    }
                }
            }
        }
    }
    return;
}

function isWall(map_x, map_y) {
    if (map_x == 0 && mapy == 0) {
        return "UL";
    } else if (map_x==0 && mapy==15) {
        return "DL";
    } else if (map_x==19 && mapy==0) {
        return "UR";
    } else if (map_x==19 && mapy==15) {
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
    currx = 1;
    curry = 1;
    mapx = 2;
    mapy = 2;
    moveScreen();
}

function initForest() {
    var floor_tile = PIXEL*2;
    for (var i=0; i < SIDE_LENGTH; i+= floor_tile) {
        for (var j=0; j < SIDE_LENGTH; j+= floor_tile) {
            context.fillStyle = snowcount < 0 ? randFromArray(FLOOR_GRADIENT) : randFromArray(SNOW_GRADIENT);
            context.fillRect(i,j,floor_tile,floor_tile);
        }
    }
    drawPath(currx*2, curry*2);
    populateTrees();
    drawPerson(currx,curry);
}

function initTown() {
    var floor_tile = PIXEL*2;
    for (var i=0; i < SIDE_LENGTH; i+= floor_tile) {
        for (var j=0; j < SIDE_LENGTH; j+= floor_tile) {
            context.fillStyle = snowcount < 0 ? randFromArray(PATH_GRADIENT) : randFromArray(SNOWPATH_GRADIENT);
            context.fillRect(i,j,floor_tile,floor_tile);
        }
    }
    for (var i=0; i < grid.length; i++) {
        for (var j=0; j<grid.length; j++) {
            grid[i][j] = ENUM_PATH;
        }
    }
    populateBuildings();
    drawPerson(currx,curry);
}

function createBuilding(Tx, Ty, Bx, By, BC) {
    var roofbase = snowcount < 0 ? randFromArray(ROOFS) : randFromArray(SNOWROOFS);
    for (var i = Tx; i <= Bx; i++) {
        for (var j = Ty; j <= By; j++) {
            grid[i][j] = ENUM_BLOCKED;
            if (i <= Tx+1 || j <= Ty+1 || i >= Bx-1 || j >= By-1) {
                context.fillStyle = WALL_GREY;
            } else {
                context.fillStyle = roofbase[(Math.max(Math.floor(Math.abs((Tx+Bx)/2-i)), Math.floor(Math.abs((Ty+By)/2-j))))];
                // context.fillStyle = randFromArray(roofbase);
            }
            drawSquare(i, j)
            // context.fillRect(i*PIXEL,j*PIXEL,PIXEL,PIXEL);
        }
    }
    switch(randInt(0, 8)) {
        case 0:    
    }
}

function seedBuilding(TLx, TLy, BRx, BRy, BC) {
    var w = BRx-TLx;
    var h = BRy-TLy;
    Tx = randInt(Math.floor(w/8), Math.floor(w/6)) + TLx;
    Ty = randInt(Math.floor(h/8), Math.floor(h/6)) + TLy;
    ww = randInt(Math.floor(w/3), w-randInt(Math.floor(w/8), Math.floor(w/4)));
    hh = randInt(Math.floor(h/3), h-randInt(Math.floor(h/8), Math.floor(h/4)));
    Bx = Tx + ww;
    By = Ty + hh;
    createBuilding(Tx,Ty,Bx,By,BC);
}

function populateBuildings() {
    var mrg = 2;
    var inc = (grid.length - 2*mrg)/4;

    switch(randInt(0,5)) {
        case 0:
            seedBuilding(mrg, mrg, mrg+2*inc, mrg+2*inc, 11);
            seedBuilding(mrg+2*inc, mrg, mrg+4*inc, mrg+2*inc, 22);
            seedBuilding(mrg, mrg+2*inc, mrg+2*inc, mrg+4*inc, 33);
            seedBuilding(mrg+2*inc, mrg+2*inc, mrg+4*inc, mrg+4*inc, 44);
            break;
        case 1:
            seedBuilding(mrg+inc, mrg, mrg+3*inc, mrg+2*inc, 11);
            seedBuilding(mrg, mrg+2*inc, mrg+2*inc, mrg+4*inc, 22);
            seedBuilding(mrg+2*inc, mrg+2*inc, mrg+4*inc, mrg+4*inc, 33);
            break;
        case 2:
            seedBuilding(mrg, mrg, mrg+2*inc, mrg+2*inc, 11);
            seedBuilding(mrg+2*inc, mrg, mrg+4*inc, mrg+2*inc, 22);
            seedBuilding(mrg+1*inc, mrg+2*inc, mrg+4*inc, mrg+4*inc, 33);
            break;
        case 3:
            seedBuilding(mrg, mrg, mrg+2*inc, mrg+3*inc, 11);
            seedBuilding(mrg+2*inc, mrg, mrg+4*inc, mrg+2*inc, 22);
            seedBuilding(mrg+2*inc, mrg+2*inc, mrg+4*inc, mrg+4*inc, 33);
            break;
        case 4:
            seedBuilding(mrg, mrg+inc, mrg+2*inc, mrg+3*inc, 11);
            seedBuilding(mrg+2*inc, mrg, mrg+4*inc, mrg+2*inc, 22);
            seedBuilding(mrg+2*inc, mrg+2*inc, mrg+4*inc, mrg+4*inc, 33);
            break;
    }
    // for (var i=0; i<3; i++) {
    //     for (var j=0; j<3; j++) {
    //         seedBuilding(mrg+i*inc, mrg+j*inc, mrg+(i+1)*inc, mrg+(j+1)*inc, (3*i+j)*11);
    //     }
    // }
    // seedBuilding(mrg, mrg, (grid.length-8)/3, (grid.length-8)/3, 11);
    // seedBuilding(4, grid.length/2, grid.length/2, grid.length, 22);
    // seedBuilding(grid.length/2, 4, grid.length, grid.length/2, 33); 
    // seedBuilding(grid.length/2, grid.length/2, grid.length, grid.length, 44); 
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