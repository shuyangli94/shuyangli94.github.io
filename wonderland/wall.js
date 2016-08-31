function isWall(map_x, map_y) {
    if (map_x == 0 && map_y == 0) {
        return "UL";
    } else if (map_x==0 && map_y==map_ybound) {
        return "DL";
    } else if (map_x==map_xbound && map_y==0) {
        return "UR";
    } else if (map_x==map_xbound && map_y==map_ybound) {
        return "DR";
    } else if (map_x==0) {
        return "L";
    } else if (map_x==map_xbound) {
        return "R";
    } else if (map_y==0) {
        return "U";
    } else if (map_y==map_ybound) {
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