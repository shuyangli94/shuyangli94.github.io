var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var SIDE_LENGTH = canvas.width;
var PIXEL = 8;

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
        var eR = (endR.r-startR.r)*(i/steps)+startR.r;
        var eG = (endR.g-startR.g)*(i/steps)+startR.g;
        var eB = (endR.b-startR.b)*(i/steps)+startR.b;
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
// var FLOOR_GRADIENT = ["#A5A762","#CCCB99","#74664E"];

var ENUM_TREE = -1;
var ENUM_PATH = 1;
var ENUM_PERSON = 111;

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
    var floor_tile = PIXEL*2;
    for (var i=0; i < SIDE_LENGTH; i+= floor_tile) {
        for (var j=0; j < SIDE_LENGTH; j+= floor_tile) {
            context.fillStyle = FLOOR_GRADIENT[Math.floor(Math.random() * FLOOR_GRADIENT.length)];
            context.fillRect(i,j,floor_tile,floor_tile);
        }
    }
    
    return arr;
}

function createCircle(gridx, gridy, leafColor, trunkColor) {
    context.fillStyle = TREE_BROWNS[trunkColor];
    context.fillRect(gridx*PIXEL, gridy*PIXEL, PIXEL, PIXEL);
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
    var p = 5;
    for (var i=-p; i < p+1; i++) {
        for (var j=-p; j < p+1; j++) {
            if (x >= -i && x < grid.length - i && y >= -j && y <= grid.length - j) {
                grid[x+i][y+j] = ENUM_PATH;
                context.fillStyle = PATH_GRADIENT[Math.floor(Math.random() * PATH_GRADIENT.length)];
                context.fillRect((x+i)*PIXEL,(y+j)*PIXEL,PIXEL,PIXEL);
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

function checkKey(e) {
    e.preventDefault();
    e = e || window.event;

    if (e.keyCode == '38') { // UP
        console.log("Move up");
        if (curry == 0) {
            console.log("Exit upwards");
            curry = grid.length/2 - 1;
            moveScreen();
            console.log("Moved?");
            return;
            // Exit upwards
        } else {
            if (grid[currx*2][(curry-1)*2] != ENUM_PATH || grid[currx*2][(curry-1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry-1)*2] != ENUM_PATH || grid[currx*2+1][(curry-1)*2+1] != ENUM_PATH) { // Wrong
            } else {
                curry -= 1;
                drawPerson(currx, curry);
                for (var i = currx*2; i <= currx*2+1; i++) {
                    for (var j=curry*2+2; j <= curry*2+3; j++) {
                        grid[i][j] = ENUM_PATH;
                        context.fillStyle = PATH_GRADIENT[Math.floor(Math.random() * PATH_GRADIENT.length)];
                        context.fillRect((i)*PIXEL,(j)*PIXEL,PIXEL,PIXEL);
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
            moveScreen();
            console.log("Moved?");
            return;
            // Exit upwards
        } else {
            if (grid[currx*2][(curry+1)*2] != ENUM_PATH || grid[currx*2][(curry+1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry+1)*2] != ENUM_PATH || grid[currx*2+1][(curry+1)*2+1] != ENUM_PATH) { // Wrong
            } else {
                curry += 1;
                drawPerson(currx, curry);
                for (var i = currx*2; i <= currx*2+1; i++) {
                    for (var j=curry*2-2; j <= curry*2-1; j++) {
                        grid[i][j] = ENUM_PATH;
                        context.fillStyle = PATH_GRADIENT[Math.floor(Math.random() * PATH_GRADIENT.length)];
                        context.fillRect((i)*PIXEL,(j)*PIXEL,PIXEL,PIXEL);
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
            moveScreen();
            console.log("Moved?");
            return;
            // Exit upwards
        } else {
            if (grid[(currx-1)*2][curry*2] != ENUM_PATH || grid[(currx-1)*2+1][curry*2] != ENUM_PATH || grid[(currx-1)*2][curry*2+1] != ENUM_PATH || grid[(currx-1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
            } else {
                currx -= 1;
                drawPerson(currx, curry);
                for (var i = currx*2+2; i <= currx*2+3; i++) {
                    for (var j=curry*2; j <= curry*2+1; j++) {
                        grid[i][j] = ENUM_PATH;
                        context.fillStyle = PATH_GRADIENT[Math.floor(Math.random() * PATH_GRADIENT.length)];
                        context.fillRect((i)*PIXEL,(j)*PIXEL,PIXEL,PIXEL);
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
            moveScreen();
            console.log("Moved?");
            return;
            // Exit upwards
        } else {
            if (grid[(currx+1)*2][curry*2] != ENUM_PATH || grid[(currx+1)*2+1][curry*2] != ENUM_PATH || grid[(currx+1)*2][curry*2+1] != ENUM_PATH || grid[(currx+1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
            } else {
                currx += 1;
                drawPerson(currx, curry);
                for (var i = currx*2-2; i <= currx*2-1; i++) {
                    for (var j=curry*2; j <= curry*2+1; j++) {
                        grid[i][j] = ENUM_PATH;
                        context.fillStyle = PATH_GRADIENT[Math.floor(Math.random() * PATH_GRADIENT.length)];
                        context.fillRect((i)*PIXEL,(j)*PIXEL,PIXEL,PIXEL);
                    }
                }
            }
        }
    }
    return;
}

function initialize(context, canvas) {
    canvas.addEventListener("keydown", checkKey, false);
    grid = createGrid();
    currx = 1;
    curry = 1;
    drawPath(currx*2, curry*2);
    populateTrees();
    drawPerson(currx,curry);
}

function moveScreen() {
    // context.clearRect(0,0,SIDE_LENGTH,SIDE_LENGTH);
    grid = createGrid();
    drawPath(currx*2, curry*2);
    populateTrees();
    drawPerson(currx,curry);
}

initialize(context, canvas);