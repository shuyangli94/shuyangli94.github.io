function createTree(center_x, center_y, radius) {
    var centerbase = GREEN_GRADIENT.length - Math.floor(Math.random() * 5) - 1;
    var trunkcolor = randFromArray(TREE_BROWNS);
    for (var x=Math.max(0,center_x-radius); x<Math.min(grid.length,center_x+radius+1); x++) {
        for (var y=Math.max(0,center_y-radius); y<Math.min(grid.length,center_y+radius+1); y++) {
            var df = distanceFrom(x,y,center_x, center_y);
            if (df <= radius-0.2) {
                createCircle(x,y,GREEN_GRADIENT[radius-Math.floor(df)], trunkcolor);
                grid[x][y] = ENUM_TREE;
            }
        }
    }
    // for (var i=(-1*radius); i < radius+1; i++) {
    //     for (var j=(-1*radius); j < radius+1; j++) {
    //         // console.log(i + " " + j);
    //         if (radius > 2) {
    //             if (!(Math.abs(i) == radius && Math.abs(j) == radius) && !(Math.abs(i) == radius && Math.abs(j) == radius-1) && !(Math.abs(i) == radius-1 && Math.abs(j) == radius)) {
    //                 if (radius * 2 + centerbase >= GREEN_GRADIENT.length) {
    //                     var leafColor = Math.max(Math.abs(i),Math.abs(j))*-2 + centerbase;
    //                 } else {
    //                     var leafColor = Math.max(Math.abs(i),Math.abs(j))*-3 + centerbase;
    //                 }
                    
    //                 if (center_x >= -i && center_x < grid.length - i && center_y >= -j && center_y <= grid.length - j) {
    //                     createCircle(center_x + i, center_y + j, GREEN_GRADIENT[leafColor], trunkcolor);
    //                     grid[center_x + i][center_y + j] = ENUM_TREE;
    //                 }
    //             }
    //         } else {
    //             if (!(Math.abs(i) == radius && Math.abs(j) == radius)) {
    //                 if (radius * 2 + centerbase >= GREEN_GRADIENT.length) {
    //                     var leafColor = Math.max(Math.abs(i),Math.abs(j))*-2 + centerbase;
    //                 } else {
    //                     var leafColor = Math.max(Math.abs(i),Math.abs(j))*-3 + centerbase;
    //                 }
                    
    //                 if (center_x >= -i && center_x < grid.length - i && center_y >= -j && center_y <= grid.length - j) {
    //                     createCircle(center_x + i, center_y + j, GREEN_GRADIENT[leafColor], trunkcolor);
    //                     grid[center_x + i][center_y + j] = ENUM_TREE;
    //                 }
    //             }
    //         }
    //     }
    // }
}

function populateTrees() {
    var g = 10;
    for (var i = 0; i < grid.length / g; i++) {
        for (var j = 0; j < grid.length / g; j++) {
            var x = Math.floor(Math.random()*g) + i * g;
            var y = Math.floor(Math.random()*g) + j * g;
            if (grid[x][y] != ENUM_PATH) {
                var rad = Math.floor(Math.random()*5) + 3;
                createTree(x,y,rad);
            }
        }
    }

}

function drawForestPath(startx, starty) {
    var n = randInt(2,6);
    var end = getEnd(startx, starty, n);
    for (var i = 0; i < n; i++) {
        var endx = end[0][i];
        var endy = end[1][i];
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
            drawPathTile(cx,cy, PATH_RADIUS);
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
            drawPathTile(cx,cy, PATH_RADIUS);
        }
    }

}

function getEnd(startx, starty, n) {
    var endxs = [];
    var endys = [];
    for (var i = 0; i < n; i++) {
        var endx = 0;
        var endy = 0;
        if (startx < grid.length / 2) {
            if (starty < grid.length / 2) { // upper left
                if (Math.random() < 0.5) {
                    endx = grid.length - 1;
                    endy = Math.floor(Math.random() * (grid.length*7/8)) + Math.floor(grid.length/8);
                } else {
                    endy = grid.length - 1;
                    endx = Math.floor(Math.random() * (grid.length*7/8)) + Math.floor(grid.length/8);
                }
            } else { // lower left
                if (Math.random() < 0.5) {
                    endx = grid.length - 1;
                    endy = Math.floor(Math.random() * (grid.length*7/8));
                } else {
                    endy = 0;
                    endx = Math.floor(Math.random() * (grid.length*7/8)) + Math.floor(grid.length/8);
                }
            }
        } else {
            if (starty < grid.length / 2) { // upper right
                if (Math.random() < 0.5) {
                    endx = 0;
                    endy = Math.floor(Math.random() * (grid.length*7/8)) + Math.floor(grid.length/8);
                } else {
                    endy = grid.length - 1;
                    endx = Math.floor(Math.random() * (grid.length*7/8));
                }
            } else { // lower right
                if (Math.random() < 0.5) {
                    endx = 0;
                    endy = Math.floor(Math.random() * (grid.length*7/8));
                } else {
                    endy = 0;
                    endx = Math.floor(Math.random() * (grid.length*7/8));
                }
            }
        }
        if (endxs.indexOf(endx) > -1 && endys.indexOf(endy) > -1) {
            i--;
        } else {
            endxs.push(endx);
            endys.push(endy);
        }
    }
    
    return [endxs, endys];
}

function initForest() {
    var floor_tile = PIXEL*2;
    for (var i=0; i < SIDE_LENGTH; i+= floor_tile) {
        for (var j=0; j < SIDE_LENGTH; j+= floor_tile) {
            context.fillStyle = snowcount < 0 ? randFromArray(FLOOR_GRADIENT) : randFromArray(SNOW_GRADIENT);
            context.fillRect(i,j,floor_tile,floor_tile);
        }
    }
    drawForestPath(currx*2, curry*2);
    populateTrees();
    drawPerson(currx,curry);
}