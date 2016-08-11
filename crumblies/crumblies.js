var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var PIXEL_HEIGHT = 1;
var COOKIE_WIDTH = canvas.width;
var CHOC_WIDTH = Math.floor(COOKIE_WIDTH * 0.05);
var CHOC_BOX = Math.floor(COOKIE_WIDTH / 7); // Boxes for randomly choosing chocolate chip UL point
var COOKIE_COLOR = "#BA8C50";
var CHOC_COLOR = "#4E2E28";
var enum_COOKIE = 0;
var enum_CHOC = -1;
var enum_CRACK = 1;
var grid = [];
var area_left = COOKIE_WIDTH * COOKIE_WIDTH;
var max_area = COOKIE_WIDTH * COOKIE_WIDTH;
var crumble_count = 0;
var avg_crumble = 0;
var max_crumble = 0;
var min_crumble = max_area;
var score = 0;
// var crumble_sound = new Audio('crumble_sound.mp3');

function getSquare(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: 1 + (evt.clientX - rect.left) - (evt.clientX - rect.left)%PIXEL_HEIGHT,
        y: 1 + (evt.clientY - rect.top) - (evt.clientY - rect.top)%PIXEL_HEIGHT
    };
}

function fillSquare(context, x, y, color = "#fff"){
    context.fillStyle = color;
    context.fillRect(x,y,PIXEL_HEIGHT,PIXEL_HEIGHT);
}

function createGrid() {
    var arr = [];
    for (var i=0; i<=COOKIE_WIDTH; i++) {
        arr[i] = [];
        for (var j=0; j<=COOKIE_WIDTH; j++) {
            if (i < PIXEL_HEIGHT || j < PIXEL_HEIGHT) {
                arr[i][j] = enum_CRACK
            } else if (i > COOKIE_WIDTH - PIXEL_HEIGHT || j > COOKIE_WIDTH - PIXEL_HEIGHT) {
                arr[i][j] = enum_CRACK
            } else {
                arr[i][j] = enum_COOKIE;
            }
        }
    }
    return arr;
}

function initializeCookie(context) {
    //drawGrid(context);
    grid = createGrid();
    context.fillStyle = COOKIE_COLOR;
    context.fillRect(0,0,COOKIE_WIDTH,COOKIE_WIDTH);
    crumble_count = 0;
    area_left = COOKIE_WIDTH * COOKIE_WIDTH;
    score = 0;

    context.fillStyle = CHOC_COLOR;
    for (var i=1; i < 7; i+= 2) {
        for (var j=1; j<7; j+= 2) {
            var ulx = i*CHOC_BOX + Math.floor(Math.random() * CHOC_BOX);
            var uly = j*CHOC_BOX + Math.floor(Math.random() * CHOC_BOX);
            var chipsize = Math.floor(CHOC_WIDTH * (Math.random() * 0.5 + 0.65));
            context.fillRect(ulx,uly,chipsize,chipsize);
            for (var gx=ulx; gx < ulx + chipsize + 1; gx++) {
                for (var gy=uly; gy < uly + chipsize + 1; gy++) {
                    grid[gx][gy] = enum_CHOC;
                }
            }
        }
    }

    document.getElementById("area_left").innerHTML = area_left + " pixels remaining";
    document.getElementById("crumbles").innerHTML = crumble_count + " crumbles";
    document.getElementById("area_stats").innerHTML = "<font color='white'>.</font>";
    document.getElementById("score").innerHTML = "SCORE: " + score;
}

function crumble(context, xdir, ydir, xstart, ystart) {
    var currx = xstart;
    var curry = ystart;
    var bias = Math.floor(Math.random() * 60) + 10;
    var counter = 0;
    while (true) {
        // if (counter == 0) {
        //     fillSquare(context, currx, curry, "#f00");
        // } else {
        //     fillSquare(context, currx, curry);
        // }
        fillSquare(context, currx, curry);
        for (var gi=currx; gi < currx + PIXEL_HEIGHT; gi++) {
            for (var gj=curry; gj < curry + PIXEL_HEIGHT; gj++) {
                grid[gi][gj] = enum_CRACK;
            }
        }

        var stepDir = Math.floor(Math.random() * 100);
        if (stepDir < bias) {
            currx += (xdir * PIXEL_HEIGHT);
        } else {
            curry += (ydir * PIXEL_HEIGHT);
        }

        if (counter > 0) { // Break loop if we exit the bounds, hit a crack, or hit a chocolate chip
            if (currx > COOKIE_WIDTH + 1 || curry > COOKIE_WIDTH + 1) {
                console.log("Broken by exiting outer bounds");
                return "Outer";
            } else if (currx < 0 || curry < 0) {
                console.log("Broken by exiting inner bounds");
                return "Inner";
            } else if (grid[currx][curry] == enum_CRACK) {
                console.log("Broken by reaching crack at " + currx + " " + curry);
                return "Crack";
            } else if (grid[currx][curry] == enum_CHOC) {
                console.log("Broken by reaching chocolate chip at " + currx + " " + curry);
                return "Chocolate";
            }
        }

        counter++;
    }
    return "NONE";
}

function crumbleDirections(context, mouseX, mouseY) {
    var quadrantBound = Math.floor(COOKIE_WIDTH / 2)
    var c1;
    var c2;
    if (mouseX > quadrantBound) { // Right
        if (mouseY > quadrantBound) { // Lower right
            if (Math.random() < 0.5) {
                c1 = crumble(context, 1, 1, mouseX, mouseY); // DR
                c2 = crumble(context, 1, -1, mouseX, mouseY - PIXEL_HEIGHT); // UR
            } else {
                c1 = crumble(context, 1, 1, mouseX, mouseY); // DR
                c2 = crumble(context, -1, 1, mouseX - PIXEL_HEIGHT, mouseY); // DL
            }
        } else { // Upper right
            if (Math.random() < 0.5) {
                c1 = crumble(context, -1, -1, mouseX, mouseY); // UL
                c2 = crumble(context, 1, -1, mouseX + PIXEL_HEIGHT, mouseY); // UR
            } else {
                c1 = crumble(context, 1, 1, mouseX, mouseY); // DR
                c2 = crumble(context, 1, -1, mouseX, mouseY - PIXEL_HEIGHT); // UR
            }
        }
    } else { // Left
        if (mouseY > quadrantBound) { // Lower left
            if (Math.random() < 0.5) {
                c1 = crumble(context, -1, 1, mouseX, mouseY); // DL
                c2 = crumble(context, -1, -1, mouseX, mouseY - PIXEL_HEIGHT); // UL
            } else {
                c1 = crumble(context, 1, 1, mouseX, mouseY); // DR
                c2 = crumble(context, -1, 1, mouseX - PIXEL_HEIGHT, mouseY); // DL
            }
        } else { // Upper left
            if (Math.random() < 0.5) {
                c1 = crumble(context, -1, -1, mouseX, mouseY); // UL
                c2 = crumble(context, 1, -1, mouseX + PIXEL_HEIGHT, mouseY); // UR
            } else {
                c1 = crumble(context, -1, 1, mouseX, mouseY); // DL
                c2 = crumble(context, -1, -1, mouseX, mouseY - PIXEL_HEIGHT); // UL
            }
        }
    }

    if (c1 == "Chocolate" || c2 == "Chocolate") {
        return true;
    } else {
        return false;
    }
}

initializeCookie(context);

function clickToCrackWrap() {
    canvas.addEventListener('click', clickToCrack, false);
}

var clickToCrack = function(evt) {
    var mousePos = getSquare(canvas, evt);
    console.log("Crack at " + mousePos.x + " " + mousePos.y);
    if (grid[mousePos.x][mousePos.y] == enum_CHOC) {
        console.log("You clicked on a chocolate chip!");
    } else if (grid[mousePos.x][mousePos.y] == enum_CRACK) {
        console.log("You clicked on an already-broken piece!");
    } else {
        var crumbleAgain = crumbleDirections(context, mousePos.x, mousePos.y);

        if (!crumbleAgain) {
            canvas.addEventListener('click', clickToCrumble, false);
            canvas.removeEventListener('click', clickToCrack, false);
        }
    }   
}

var clickToCrumble = function(evt) {
    var mousePos = getSquare(canvas, evt);
    console.log("Crumble at " + mousePos.x + " " + mousePos.y);
    if (grid[mousePos.x][mousePos.y] == enum_COOKIE) {
        crumble_count += 1;
        var old_arealeft = area_left;
        //crumble_sound.play()
        floodFill(mousePos.x, mousePos.y, enum_CRACK);
        var crumble_area = old_arealeft - area_left;
        avg_crumble = (max_area - area_left) / crumble_count;
        if (crumble_area > max_crumble) {
            max_crumble = crumble_area;
        }
        if (crumble_area < min_crumble) {
            min_crumble = crumble_area;
        }

        var score_change = Math.floor(0.001*crumble_count*crumble_count*(crumble_area + Math.floor((area_left * crumble_area)/(max_crumble-min_crumble+1))));
        score += score_change;
        document.getElementById("score").innerHTML = "SCORE: " + score + " (+" + score_change + ")";
        document.getElementById("crumbles").innerHTML = "<b>" + crumble_count + "</b> crumbles";
        document.getElementById("area_stats").innerHTML = "<font color='red'>" + avg_crumble + "</font> average area crumbled; <font color='blue'>" + max_crumble + "</font> max area crumbled; <font color='green'>" + min_crumble + "</font> min area crumbled";
        document.getElementById("area_left").innerHTML = "<b>" + area_left + "</b> pixels remaining";
    } else {
        console.log("You need to click on the cookie itself to crumble!");
        return;
    }

    canvas.addEventListener('click', clickToCrack, false);
    canvas.removeEventListener('click', clickToCrumble, false);
}

clickToCrackWrap();

// DEPRECATED FUNCTIONS

function drawGrid(context) {
    for (var x = 0.5; x < COOKIE_WIDTH + 1; x += PIXEL_HEIGHT) {
      context.moveTo(x, 0);
      context.lineTo(x, COOKIE_WIDTH);
    }
    
    for (var y = 0.5; y < COOKIE_WIDTH + 1; y += PIXEL_HEIGHT) {
      context.moveTo(0, y);
      context.lineTo(COOKIE_WIDTH, y);
    }
    
    context.strokeStyle = "#fff";
    context.stroke();
}