var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var PIXEL_HEIGHT = 1;
var COOKIE_WIDTH = canvas.width;
var CHOC_WIDTH = Math.floor(COOKIE_WIDTH * 0.05);
var CHOC_BOX = Math.floor(COOKIE_WIDTH / 7); // Boxes for randomly choosing chocolate chip UL point
var COOKIE_COLOR = "#BA8C50";
var CHOC_COLOR = "#4E2E28";
var CRACK_COLOR = "#FFFFFF";
var enum_COOKIE = 0;
var enum_CHOC = -1;
var enum_CRACK = 1;

var grid = [];
var area_left = COOKIE_WIDTH * COOKIE_WIDTH;
var area_left_p = 100;
var max_area = COOKIE_WIDTH * COOKIE_WIDTH;
var crumble_count = 0;
var crumble_count_total = 0;
var avg_crumble = 0;
var max_crumble = 0;
var min_crumble = max_area;
var score = 0;
var score_bonus = 0;
var chips = [];
// var crumble_sound = new Audio('crumble_sound.mp3');

function logCrumble(message) {
    for (var i=5; i>0; i--) {
        document.getElementById("log" + i).innerHTML = document.getElementById("log"+(i-1)).innerHTML;
    }
    document.getElementById("log0").innerHTML = message;
}

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

function loadCookie(existingGrid) {
    for (var i=0; i <= COOKIE_WIDTH; i++) {
        for (var j=0; j <= COOKIE_WIDTH; j++) {
            if (existingGrid[i][j] == enum_COOKIE) {
                context.fillStyle = COOKIE_COLOR;
                context.fillRect(i, j, PIXEL_HEIGHT, PIXEL_HEIGHT);
            } else if (existingGrid[i][j] == enum_CRACK) {
                context.fillStyle = CRACK_COLOR;
                context.fillRect(i, j, PIXEL_HEIGHT, PIXEL_HEIGHT);
            } else {
                context.fillStyle = CHOC_COLOR;
                context.fillRect(i, j, PIXEL_HEIGHT, PIXEL_HEIGHT);
            }
        }
    }
}

function loadState() {
    grid = JSON.parse(localStorage.getItem('crumbleGrid'));
    chips = JSON.parse(localStorage.getItem('crumbleChips'));
    area_left = parseInt(localStorage.getItem('area_left'));
    area_left_p = parseInt(localStorage.getItem('area_left_p'));
    score = parseInt(localStorage.getItem('score'));
    score_bonus = parseInt(localStorage.getItem('score_bonus'));
    crumble_count = parseInt(localStorage.getItem('crumble_count'));
    crumble_count_total = parseInt(localStorage.getItem('crumble_count_total'));
    avg_crumble = parseInt(localStorage.getItem('avg_crumble'));
    max_crumble = parseInt(localStorage.getItem('max_crumble'));
    min_crumble = parseInt(localStorage.getItem('min_crumble'));
    document.getElementById("avg_crumble").innerHTML = avg_crumble;
    document.getElementById("max_crumble").innerHTML = max_crumble;
    document.getElementById("min_crumble").innerHTML = min_crumble;
    for (var i=9; i>0; i--) {
        document.getElementById("chip" + i).innerHTML = localStorage.getItem('chip' + i);
    }
    document.getElementById("area_left").innerHTML = area_left + " <span style='font-weight:normal;'>(" + (area_left_p).toFixed(2) + "%)</style>";
    document.getElementById("crumbles").innerHTML = crumble_count + " <span style='font-weight:normal;'>(" + crumble_count_total + " Total)</style>";
    document.getElementById("score").innerHTML = "SCORE: " + score;
    loadCookie(grid);
}

function saveState() {
    localStorage.setItem('crumbleGrid', JSON.stringify(grid));
    localStorage.setItem('crumbleChips', JSON.stringify(chips));
    localStorage.setItem('area_left', area_left);
    localStorage.setItem('area_left_p', area_left_p);
    localStorage.setItem('score', score);
    localStorage.setItem('score_bonus', score_bonus);
    localStorage.setItem('crumble_count', crumble_count);
    localStorage.setItem('crumble_count_total', crumble_count_total);
    localStorage.setItem('avg_crumble', avg_crumble);
    localStorage.setItem('max_crumble', max_crumble);
    localStorage.setItem('min_crumble', min_crumble);
    for (var i=9; i>0; i--) {
        localStorage.setItem('chip' + i, document.getElementById("chip" + i).innerHTML);
    }
}

function resetState() {
    var confirmReset = confirm("Resetting will clear the current cookie and all statistics. Are you sure?")
    if (confirmReset == true) {
        localStorage.removeItem('crumbleGrid');
        localStorage.removeItem('crumbleChips');
        localStorage.removeItem('area_left');
        localStorage.removeItem('area_left_p');
        localStorage.removeItem('score');
        localStorage.removeItem('score_bonus');
        localStorage.removeItem('crumble_count');
        localStorage.removeItem('crumble_count_total');
        localStorage.removeItem('avg_crumble');
        localStorage.removeItem('max_crumble');
        localStorage.removeItem('min_crumble');
        for (var i=9; i>0; i--) {
            localStorage.removeItem('chip' + i);
        }
        initialize(context);
    }
}

function initialize(context) {
    if (localStorage.getItem('crumbleGrid') === null) {
        crumble_count_total = 0;
        score = 0;
        avg_crumble = 0;
        max_crumble = 0;
        min_crumble = max_area;
        document.getElementById("avg_crumble").innerHTML = "<font color='#fff'>0</font>";
        document.getElementById("max_crumble").innerHTML = "<font color='#fff'>0</font>";
        document.getElementById("min_crumble").innerHTML = "<font color='#fff'>0</font>";
        initializeCookie(context);
        for (var i=5; i>-1; i--) {
            document.getElementById("log" + i).innerHTML = "";
        }
        canvas.addEventListener('click', clickToCrack, false);
        canvas.addEventListener('contextmenu', clickToCrumble, false);
    } else {
        loadState();
        canvas.addEventListener('click', clickToCrack, false);
        canvas.addEventListener('contextmenu', clickToCrumble, false);
    }
}

function initializeCookie(context) {
    score_bonus = 0;
    chips = [];
    //drawGrid(context);
    grid = createGrid();
    context.fillStyle = COOKIE_COLOR;
    context.fillRect(0,0,COOKIE_WIDTH,COOKIE_WIDTH);
    crumble_count = 0;
    area_left = COOKIE_WIDTH * COOKIE_WIDTH;
    area_left_p = area_left*100/max_area;

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
            var newchip = {centerX: Math.floor(ulx + chipsize / 2), centerY: Math.floor(uly + chipsize / 2), crumbled:false};
            chips.push(newchip);
        }
    }
    for (var i=9; i>0; i--) {
        document.getElementById("chip" + i).innerHTML = "Chip " + i;
    }

    document.getElementById("area_left").innerHTML = area_left + " <span style='font-weight:normal;'>(" + (area_left_p).toFixed(2) + "%)</style>";
    document.getElementById("crumbles").innerHTML = crumble_count + " <span style='font-weight:normal;'>(" + crumble_count_total + " Total)</style>";
    document.getElementById("score").innerHTML = "SCORE: " + score;
}

function crumble(context, xdir, ydir, xstart, ystart) {
    var currx = xstart;
    var curry = ystart;
    var bias = Math.floor(Math.random() * 60) + 10;
    var counter = 0;
    while (true) {
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

function checkChips() {
    var chcount = 0;
    for (i=0; i<9; i++) {
        if (!chips[i].crumbled) {
            if (grid[chips[i].centerX][chips[i].centerY] == enum_CRACK) {
                chips[i].crumbled = true;
                chcount += 1;
                if (score_bonus > 2.5) {
                    document.getElementById("chip" + (i+1)).innerHTML = "<s>Chip " + (i+1) + "</s> (Score +100%)";
                    score_bonus += 1.0;
                } else {
                    document.getElementById("chip" + (i+1)).innerHTML = "<s>Chip " + (i+1) + "</s> (Score +50%)";
                    score_bonus += 0.5;
                }
            }
        }
    }
    return chcount;
}

function showInstructions() {
    document.getElementById('infoModal').style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById('infoModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('infoModal')) {
        document.getElementById('infoModal').style.display = "none";
    }
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
        saveState();

        // if (!crumbleAgain) {
        //     canvas.addEventListener('click', clickToCrumble, false);
        //     canvas.removeEventListener('click', clickToCrack, false);
        // }
    }   
}

var clickToCrumble = function(evt) {
    evt.preventDefault();
    var mousePos = getSquare(canvas, evt);
    console.log("Crumble at " + mousePos.x + " " + mousePos.y);
    if (grid[mousePos.x][mousePos.y] == enum_COOKIE) {
        crumble_count += 1;
        crumble_count_total += 1;
        var old_arealeft = area_left;
        //crumble_sound.play()
        floodFill(mousePos.x, mousePos.y, enum_CRACK);
        var crumble_area = old_arealeft - area_left;
        avg_crumble = (max_area - area_left) / crumble_count_total;
        if (crumble_area > max_crumble) {
            max_crumble = crumble_area;
        }
        if (crumble_area < min_crumble) {
            min_crumble = crumble_area;
        }
        area_left_p = area_left*100/max_area;

        var chcount = checkChips();

        // var score_change = crumble_count/(max_crumble-min_crumble+1);
        var score_change = 0;
        var color_mod = " (<font color='";

        // logCrumble("You fed the ants a piece of size " + crumble_area);
        if (crumble_area < max_area * 0.005) {
            logCrumble(">You drop a few laughable motes of cookie.");
            logCrumble("You can hear their tiny grumbles.");
            score_change = 20;
            color_mod += "#998100'>"
        } else if (crumble_area < max_area * 0.02) {
            logCrumble(">Some crumbs fall by the ants.");
            logCrumble("Their happy chatter fills you with joy.");
            score_change = 200;
            color_mod += "green'>"
        } else if (crumble_area < max_area * 0.05) {
            logCrumble(">You watch the ants mill about industriously.");
            score_change = 100;
            color_mod += "green'>"
        } else if (crumble_area < max_area * 0.15) {
            logCrumble(">The ants cautiously examine the cookie.");
            score_change = 20;
            color_mod += "#998100'>"
        } else if (crumble_area < max_area * 0.25) {
            logCrumble(">The ants go marching one by one--");
            logCrumble("around the hunk of cookie you dropped.");
            score_change = 0;
            color_mod += "red'>"
        } else {
            logCrumble(">You toss out a huge chunk of cookie.");
            logCrumble("You hear a tiny, furious <i><b>'What the hell, man!'</b></i>");
            score_change = -1000;
            color_mod += "red'>"
        }

        score_change *= (1 + score_bonus);

        score += score_change;
        if (score_change < 0) {
            document.getElementById("score").innerHTML = "SCORE: " + score + color_mod + score_change + "</font>)";
        } else {
            document.getElementById("score").innerHTML = "SCORE: " + score + color_mod + "+" + score_change + "</font>)";
        }
        
        document.getElementById("crumbles").innerHTML = crumble_count + " <span style='font-weight:normal;'>(" + crumble_count_total + " Total)</style>";
        document.getElementById("avg_crumble").innerHTML = avg_crumble.toFixed(0);
        document.getElementById("max_crumble").innerHTML = max_crumble;
        document.getElementById("min_crumble").innerHTML = min_crumble;
        document.getElementById("area_left").innerHTML = area_left + " <span style='font-weight:normal;'>(" + (area_left_p).toFixed(2) + "%)</style>";

        if (chcount == 1) {
            logCrumble(">The ants find a chocolate chip!");
        } else if (chcount > 1) {
            logCrumble(">The ants find <b>" + chcount + "</b> chocolate chips!");
        }

        if (area_left < max_area * 0.05) {
            console.log("New cookie!");
            crumble_count_total += 1;
            initializeCookie(context);
            logCrumble("<b>You finished that cookie! Time for another.</b>");
        }
        saveState();
    } else {
        console.log("You need to click on the cookie itself to crumble!");
        return;
    }

    //canvas.addEventListener('click', clickToCrack, false);
    //canvas.removeEventListener('click', clickToCrumble, false);
}

initialize(context);

// DEPRECATED FUNCTIONS

// function drawGrid(context) {
//     for (var x = 0.5; x < COOKIE_WIDTH + 1; x += PIXEL_HEIGHT) {
//       context.moveTo(x, 0);
//       context.lineTo(x, COOKIE_WIDTH);
//     }
    
//     for (var y = 0.5; y < COOKIE_WIDTH + 1; y += PIXEL_HEIGHT) {
//       context.moveTo(0, y);
//       context.lineTo(COOKIE_WIDTH, y);
//     }
    
//     context.strokeStyle = "#fff";
//     context.stroke();
// }