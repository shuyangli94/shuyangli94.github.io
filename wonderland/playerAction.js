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
            if (grid[currx*2][(curry-1)*2] == ENUM_BLDG || grid[currx*2][(curry-1)*2+1] == ENUM_BLDG || grid[currx*2+1][(curry-1)*2] == ENUM_BLDG || grid[currx*2+1][(curry-1)*2+1] == ENUM_BLDG) {
                logPane("You try the knob, but the door is locked.");
            } else if (grid[currx*2][(curry-1)*2] != ENUM_PATH || grid[currx*2][(curry-1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry-1)*2] != ENUM_PATH || grid[currx*2+1][(curry-1)*2+1] != ENUM_PATH) { // Wrong
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
            if (grid[currx*2][(curry+1)*2] == ENUM_BLDG || grid[currx*2][(curry+1)*2+1] == ENUM_BLDG || grid[currx*2+1][(curry+1)*2] == ENUM_BLDG || grid[currx*2+1][(curry+1)*2+1] == ENUM_BLDG) {
                logPane("You try the knob, but the door is locked.");
            } else if (grid[currx*2][(curry+1)*2] != ENUM_PATH || grid[currx*2][(curry+1)*2+1] != ENUM_PATH || grid[currx*2+1][(curry+1)*2] != ENUM_PATH || grid[currx*2+1][(curry+1)*2+1] != ENUM_PATH) { // Wrong
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
            if (grid[(currx-1)*2][curry*2] == ENUM_BLDG || grid[(currx-1)*2+1][curry*2] == ENUM_BLDG || grid[(currx-1)*2][curry*2+1] == ENUM_BLDG || grid[(currx-1)*2+1][curry*2+1] == ENUM_BLDG) {
                logPane("You try the knob, but the door is locked.");
            } else if (grid[(currx-1)*2][curry*2] != ENUM_PATH || grid[(currx-1)*2+1][curry*2] != ENUM_PATH || grid[(currx-1)*2][curry*2+1] != ENUM_PATH || grid[(currx-1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
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
            if (grid[(currx+1)*2][curry*2] == ENUM_BLDG || grid[(currx+1)*2+1][curry*2] == ENUM_BLDG || grid[(currx+1)*2][curry*2+1] == ENUM_BLDG || grid[(currx+1)*2+1][curry*2+1] == ENUM_BLDG) {
                logPane("You try the knob, but the door is locked.");
            } else if (grid[(currx+1)*2][curry*2] != ENUM_PATH || grid[(currx+1)*2+1][curry*2] != ENUM_PATH || grid[(currx+1)*2][curry*2+1] != ENUM_PATH || grid[(currx+1)*2+1][curry*2+1] != ENUM_PATH) { // Wrong
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

function drawPerson(x,y) {
    context.fillStyle = "#F2722C";
    context.fillRect(x*PIXEL*2, y*PIXEL*2, PIXEL*2, PIXEL*2);
    context.beginPath();
    context.arc(x*PIXEL*2+PIXEL, y*PIXEL*2+PIXEL, PIXEL/1.5, 0, 2*Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
}