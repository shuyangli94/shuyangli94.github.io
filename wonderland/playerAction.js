function replacePath(i, j) {
    grid[i][j] = ENUM_PATH;
    context.fillStyle = wonderland ? (snowcount < 0 ? (localeTag == "L" ? randFromArray(PLAINS_GRADIENT) : randFromArray(PATH_GRADIENT)) : randFromArray(SNOWPATH_GRADIENT)) : (snowcount < 0 ? randFromArray(TOKYOPATH_GRADIENT) : randFromArray(SNOWTOKYOPATH_GRADIENT));
    drawSquare(i, j);
}

function weatherMachine() {
    if (snowcount == -1) {
        wonderland ? logPane("The sun slips away to its hibernation. The snow falls once again.") : logPane("A dirty snow blankets Tokyo.");
        snowcount += 6;
    } else if (snowcount < 0) {
        if (wonderland) {
            localeTag == "F" ? logPane(sunMessages_forest[snowcount+5]) : (localeTag == "T" ? logPane(sunMessages_town[snowcount+5]) : logPane(sunMessages_plains[snowcount+5]));
        } else {
            if (localeTag == "K") {
                logPane(randFromArray(tokyo_messages));
            }
        }
        snowcount += 1;
    } else if (snowcount == 1) {
        wonderland ? logPane("You shake the last of the snow from your coat. The sun has emerged.") : logPane("The snow has stopped. The streets run dark with sooty snowmelt.");
        snowcount -= 6;
    } else if (snowcount > 0) {
        if (wonderland) {
            localeTag == "F" ? logPane(snowMessages_forest[-snowcount+5]) : (localeTag == "T" ? logPane(snowMessages_town[-snowcount+5]) : logPane(snowMessages_plains[-snowcount+5]));
        } else {
            if (localeTag == "K") {
                logPane(randFromArray(tokyo_messages));
            }
        }
        snowcount -= 1;
    } else {
        console.log("START");
        snowcount -= 5;
    }
}

function moveFigure(xdir, ydir) {
    currx += xdir;
    curry += ydir;
    drawPerson(currx, curry);
    if (ydir == -1) {
        for (var i = currx*2; i <= currx*2+1; i++) {
            for (var j=curry*2+2; j <= curry*2+3; j++) {
                replacePath(i,j)
            }
        }
    } else if (ydir == 1) {
        for (var i = currx*2; i <= currx*2+1; i++) {
            for (var j=curry*2-2; j <= curry*2-1; j++) {
                replacePath(i,j)
            }
        }
    } else if (xdir == -1) {
        for (var i = currx*2+2; i <= currx*2+3; i++) {
            for (var j=curry*2; j <= curry*2+1; j++) {
                replacePath(i,j)
            }
        }
    } else if (xdir == 1) {
        for (var i = currx*2-2; i <= currx*2-1; i++) {
            for (var j=curry*2; j <= curry*2+1; j++) {
                replacePath(i,j)
            }
        }
    }

    if (localeTag == "P") {
        drawPool();
    }

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
            weatherMachine();
            moveScreen();
            return;
            // Exit upwards
        } else {
            var gridcheck = [grid[currx*2][(curry-1)*2], grid[currx*2][(curry-1)*2+1], grid[currx*2+1][(curry-1)*2], grid[currx*2+1][(curry-1)*2+1]];
            if (gridcheck.indexOf(ENUM_BLDG) > -1) {
                logPane("You try the knob, but the door is locked.");
            } else if (gridcheck.indexOf(ENUM_WALL) > -1) {
                logPane("<i>Only the birds can pass over this wall.</i>");
            } else if (gridcheck.indexOf(ENUM_POOL) > -1) {
                logPane("You close your eyes and fall backwards into the pool.");
                wonderland = !wonderland;
                moveScreen();
            } else if (gridcheck.every(function(e) {return (e == ENUM_PATH)})) {
                moveFigure(0,-1);
            } else {
                // Impassable
            }
        }
    }
    else if (e.keyCode == '40') { // DOWN
        console.log("Move down");
        if (curry == grid.length/2 - 1) {
            console.log("Exit downwards");
            curry = 0;
            mapy += 1;
            weatherMachine();
            moveScreen();
            return;
            // Exit upwards
        } else {
            var gridcheck = [grid[currx*2][(curry+1)*2],grid[currx*2][(curry+1)*2+1],grid[currx*2+1][(curry+1)*2],grid[currx*2+1][(curry+1)*2+1]];
            if (gridcheck.indexOf(ENUM_BLDG) > -1) {
                logPane("You try the knob, but the door is locked.");
            } else if (gridcheck.indexOf(ENUM_WALL) > -1) {
                logPane("<i>Only the birds can pass over this wall.</i>");
            } else if (gridcheck.indexOf(ENUM_POOL) > -1) {
                logPane("You close your eyes and fall backwards into the pool.");
                wonderland = !wonderland;
                moveScreen();
            } else if (gridcheck.every(function(e) {return (e == ENUM_PATH)})) {
                moveFigure(0, 1);
            } else {
                // Impassable
            }
        }
    }
    else if (e.keyCode == '37') { // LEFT
        console.log("Move left");
        if (currx == 0) {
            console.log("Exit leftwards");
            currx = grid.length/2 - 1;
            mapx -= 1;
            weatherMachine();
            moveScreen();
            return;
            // Exit upwards
        } else {
            var gridcheck = [grid[(currx-1)*2][curry*2],grid[(currx-1)*2+1][curry*2],grid[(currx-1)*2][curry*2+1],grid[(currx-1)*2+1][curry*2+1]];
            if (gridcheck.indexOf(ENUM_BLDG) > -1) {
                logPane("You try the knob, but the door is locked.");
            } else if (gridcheck.indexOf(ENUM_WALL) > -1) {
                logPane("<i>Only the birds can pass over this wall.</i>");
            } else if (gridcheck.indexOf(ENUM_POOL) > -1) {
                logPane("You close your eyes and fall backwards into the pool.");
                wonderland = !wonderland;
                moveScreen();
            } else if (gridcheck.every(function(e) {return (e == ENUM_PATH)})) {
                moveFigure(-1,0);
            } else {
                // Impassable
            }
        }
    }
    else if (e.keyCode == '39') { // RIGHT
       console.log("Move right");
        if (currx == grid.length/2-1) {
            console.log("Exit rightwards");
            currx = 0;
            mapx += 1;
            weatherMachine();
            moveScreen();
            return;
            // Exit upwards
        } else {
            var gridcheck = [grid[(currx+1)*2][curry*2],grid[(currx+1)*2+1][curry*2],grid[(currx+1)*2][curry*2+1],grid[(currx+1)*2+1][curry*2+1]];
            if (gridcheck.indexOf(ENUM_BLDG) > -1) {
                logPane("You try the knob, but the door is locked.");
            } else if (gridcheck.indexOf(ENUM_WALL) > -1) {
                logPane("<i>Only the birds can pass over this wall.</i>");
            } else if (gridcheck.indexOf(ENUM_POOL) > -1) {
                logPane("You close your eyes and fall backwards into the pool.");
                wonderland = !wonderland;
                moveScreen();
            } else if (gridcheck.every(function(e) {return (e == ENUM_PATH)})) {
                moveFigure(1,0);
            } else {
                // Not a passable square
            }
        }
    }
    return;
}

function drawPerson(x,y) {
    context.fillStyle = "#F2722C";
    context.beginPath();
    context.arc(x*PIXEL*2+PIXEL, y*PIXEL*2+PIXEL, PIXEL, 0, 2*Math.PI, false);
    context.closePath();
    context.fill();
    // context.fillRect(x*PIXEL*2, y*PIXEL*2, PIXEL*2, PIXEL*2);
    context.beginPath();
    context.arc(x*PIXEL*2+PIXEL, y*PIXEL*2+PIXEL, PIXEL/1.8, 0, 2*Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
}