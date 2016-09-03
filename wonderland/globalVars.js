var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var SIDE_LENGTH = canvas.width;
var PIXEL = 8;
var mapx = 0;
var mapy = 0;
// var map = [["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","T","T","T","T","T","T","T","T","T","T","T","T","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"],
//         ["F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F"]];
// map[poolx][pooly] = "P";
var map_xbound = 30;
var map_ybound = 30;
var localeTag = "P";
var poolx = Math.floor(map_xbound/2) - 1;
var pooly = Math.floor(map_ybound/2) - 1;

function randInt(min, max) {
    return (Math.floor(Math.random()*(max-min)) + min);
}

function randFromArray(targetArray) {
    return (targetArray[Math.floor(Math.random() * targetArray.length)]);
}

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function drawSquare(x, y, border = false) {
    context.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
    if (border) {
        context.strokeStyle = shadeColor2(context.fillStyle, -0.4);
        context.strokeRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
    }
}

function drawArea(Tx, Ty, Bx, By) {
    for (var i=Tx; i<=Bx; i++) {
        for (var j=Ty; j<=By; j++) {
            drawSquare(i,j);
        }
    }
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

var GREEN_GRADIENT = generateGradient("#1A4721","#B8CB62",13);
var TREE_BROWNS = generateGradient("#1F4116","#2C4F27",4);
var PATH_GRADIENT = generateGradient("#737373","#8F8F8F",4);
var SNOWPATH_GRADIENT = generateGradient("9A9A9A", "BCBCBC", 4);

var PLAINS_GRADIENT = generateGradient("#C1CC7B","#9CA540",6);

var TOKYOPATH_GRADIENT = generateGradient("#616161","#7D7D7D",4);
var SNOWTOKYOPATH_GRADIENT = generateGradient("#8C8C8C","#ADADAD",4);

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
var GRASS_GRADIENT = generateGradient("#ADD595", "#7AC445", 6);

var FLOWER_CENTER = generateGradient("#FFFA4D", "#FFCE94", 5);
var FLOWER_PETAL = ["#E486E1","#75359C", "#6881CA", "#FE5299", "#96406C", "#288A35"];

var POOL1_GRADIENT = generateGradient("#193A86","#162F69",10); // Inner pool (deepest)
var POOL2_GRADIENT = generateGradient("#20469D", "#16367E", 10); // Middle pool
var POOL3_GRADIENT = generateGradient("#274DA5","#163C92",10); // Outer pool (shallowest)

var ROOF_COLORS = ["#7A8AB8", "#84B88B", "#CE829B", "#CE9882", "#CE82AD", "#CCCCCC"];

var ROOFS = [ROOF_GRADIENT_RED, ROOF_GRADIENT_BLUE, ROOF_GRADIENT_GREEN, ROOF_GRADIENT_YELLOW];
var SNOWROOFS = [SNOWROOF_GRADIENT_RED, SNOWROOF_GRADIENT_BLUE, SNOWROOF_GRADIENT_GREEN, SNOWROOF_GRADIENT_YELLOW];

var WALL_GRADIENT = generateGradient("#FFD700", "#FFE975",5);
// var FLOOR_GRADIENT = ["#A5A762","#CCCB99","#74664E"];
var logColors = generateGradient("#A8A8A8","#000000",4);
var snowMessages_forest = ["The snowflakes seem to avoid the trees. You follow their example.",
    "<i>You wonder what it would be like to live in a world without sound.</i>",
    "You clutch close the Colonel's walking stick and soldier onwards.",
    "The forest shifts and rearranges in the midst of snowfall."];
var sunMessages_forest = ["The Gatekeeper warned you not to wander the woods alone.",
    "<i>The woods-dwellers have no place in town, nor outside of the Wall</i>",
    "The forest shifts and rearranges around you.",
    "<i>The golden Wall seems to stare at you through the frosty air.</i>"];
var snowMessages_town = ["The snow has fallen too thick for any townspeople to work.",
    "",
    "You contemplate ducking inside somebody's home to warm up.",
    "<i>You wonder what it would be like to live in a world without sound.</i>"];
var sunMessages_town = ["In the distance, you hear the Gatekeeper's horn.",
    "You stop and stare at the roofs glittering in the sun.",
    "",
    "<i>Sometimes you wonder what would happen if the Wall fell.</i>"];
var snowMessages_plains = ["The snow falls thick on the plains.",
    "<i>You wonder what it would be like to live in a world without sound.</i>",
    "Each step uncovers grey and dying grass.",
    ""];
var sunMessages_plains = ["In the distance, you hear the Gatekeeper's horn.",
    "Flowers like these never bloomed in your hometown.",
    "",
    "<i>Didn't these plains once feature grand buildings...?</i>"];
var tokyo_messages = ["",
    "",
    "",
    ""]
var WALL_GREY = "#333333";

var ENUM_TREE = -1;
var ENUM_PATH = 1;
var ENUM_PERSON = 111;
var ENUM_WALL = -999;
var ENUM_BLOCKED = -2;
var PATH_RADIUS = 5;
var ENUM_BLDG = 11;
var ENUM_POOL = 9999;
var ENUM_BEAST = 666;

var snowcount = 0;

var grid = [];
var landPlots = [];
var currx = 0;
var curry = 0;
var wonderland = true;