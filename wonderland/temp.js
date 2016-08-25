function createBuilding(Tx, Ty, Bx, By, BC) {
    // var roofbase = snowcount < 0 ? randFromArray(ROOFS) : randFromArray(SNOWROOFS);
    var roofbase = snowcount < 0 ? ROOF_GRADIENT_RED : SNOWROOF_GRADIENT_RED;
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