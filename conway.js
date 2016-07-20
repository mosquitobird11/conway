var canvas;
var ctx;

//globals
const GRID_AMOUNT = 38;
const CELL_SIZE = 20;
const SIZE = 760;

$('#cgame').attr('width',SIZE);
$('#cgame').attr('height',SIZE);

//used to do basic color animations, goes from 0 to 255
var offset = 0;
var up = true;

var mx = 0;
var my = 0;

var on = false;

var speed = 80;

//gamegrid
var grid;

//states
const dead_living = -1;
const dead = 0;
const alive = 1;
const alive_dying = 2;


$('#cgame').on('mousedown',function(e){
    var canvas = document.getElementById('cgame');
    var rect = canvas.getBoundingClientRect();
    var mx = Math.floor(Math.floor(e.clientX - rect.left)/CELL_SIZE);
    var my = Math.floor(Math.floor(e.clientY - rect.top)/CELL_SIZE);
    flipCell(mx,my);
    setTimeout()
});

function toggleState(){
    on = !on;
    if (on){
        $('#toggleButton').text("Stop Simulation")
    }else{
        $('#toggleButton').text("Start Simulation")
    }
}

function flipCell(mx,my){
    if (grid[mx][my] == 0){
        grid[mx][my] = alive;
    }else{
        grid[mx][my] = dead;
    }
}

$('#speedbox').on('input', function() {
    speed = $('#speedbox').val();
});

//Initialize function
function init(){
    canvas = $('#cgame')[0];
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        make();
        draw();
        simulate();
    }
}

function make(){
    grid = new Array(GRID_AMOUNT);
    for (var i = 0; i < GRID_AMOUNT; i++) {
        grid[i] = new Array(GRID_AMOUNT);
    }
    for (var i = 0; i < GRID_AMOUNT; i++){
        for (var j = 0; j < GRID_AMOUNT; j++){
            grid[i][j] = 0;
        }
    }
}

function simulate(){
    if (on){
        checkRules();
        transition();
    }
    setTimeout(simulate,speed);
}

function transition(){
    for (var i = 0; i < GRID_AMOUNT; i++){
        for (var j = 0; j < GRID_AMOUNT; j++){
            if (grid[i][j] == alive_dying){
                grid[i][j] = dead;
            }
            else if (grid[i][j] == dead_living){
                grid[i][j] = alive;
            }
        }
    }
}

function checkRules(){
    for (var i = 0; i < GRID_AMOUNT; i++){
        for (var j = 0; j < GRID_AMOUNT; j++){
            if (grid[i][j] == alive){
                if (checkUnderPopCell(i,j)){
                    grid[i][j] = alive_dying;
                }
                if (checkOverPopCell(i,j)){
                    grid[i][j] = alive_dying;
                }
            }else{
                if (checkNewCell(i,j)){
                    grid[i][j] = dead_living;
                }
            }
        }
    }
}

function checkNewCell(x,y){
    return (countNeighbors(x,y) == 3);
}

function countNeighbors(x,y){
    alive_neighbors = 0;
    if (x > 0){
        if (y > 0){
            //UL
            if (grid[x-1][y-1] > 0){
                alive_neighbors+=1
            }
        }
        //ML
        if (grid[x-1][y] > 0){
            alive_neighbors+=1
        } 
        if (y < (GRID_AMOUNT - 1)){
            //BL
            if (grid[x-1][y+1] > 0){
                alive_neighbors+=1
            }
        }
    }
    if (y > 0){
        //UM
        if (grid[x][y-1] > 0){
            alive_neighbors+=1
        }
    }
    if (y < (GRID_AMOUNT - 1)){
        //BM
        if (grid[x][y+1] > 0){
            alive_neighbors+=1
        }
    }
    if (x < (GRID_AMOUNT - 1)){
        if (y > 0){
            //UR
            if (grid[x+1][y-1] > 0){
                alive_neighbors+=1
            }
        }
        //MR
        if (grid[x+1][y] > 0){
            alive_neighbors+=1
        } 
        if (y < (GRID_AMOUNT - 1)){
            //BR
            if (grid[x+1][y+1] > 0){
                alive_neighbors+=1
            }
        }
    }
    return alive_neighbors;
}

function checkUnderPopCell(x,y){
    return (countNeighbors(x,y) < 2);
}

function checkOverPopCell(x,y){
    return (countNeighbors(x,y) > 3);
}

function draw(){
    //calculate variables for drawing
    calc();
    //reset canvas for drawing
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //draw the grid
    drawGrid();
    //recall function
    setTimeout(draw,10);
}

function calc(){
    if (up){
        offset++;
        if (offset > 255) {
            up = false
        }
    }else{
        offset--;
        if (offset == 0) {
            up = true
        }
    }
}

function drawGrid(){
    for (var i = 0; i < GRID_AMOUNT; i++){
        for (var j = 0; j < GRID_AMOUNT; j++){
            ctx.fillStyle = 'rgb(100,'+Math.floor((j/3)*CELL_SIZE+offset)+',' + Math.floor((i/3)*CELL_SIZE+offset) +')';
            ctx.fillRect(j*CELL_SIZE,i*CELL_SIZE,CELL_SIZE,CELL_SIZE);
            ctx.clearRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
        }
    }
    for (var i = 0; i < GRID_AMOUNT; i++){
        for (var j = 0; j < GRID_AMOUNT; j++){
            if (grid[i][j] > 0){
                ctx.fillStyle = 'rgb(190,0,0)';
                ctx.fillRect(i*CELL_SIZE+2,j*CELL_SIZE+2,CELL_SIZE-4,CELL_SIZE-4);
            }
            else{
                ctx.clearRect(i*CELL_SIZE+2,j*CELL_SIZE+2,CELL_SIZE-4,CELL_SIZE-4);
            }
        }
    }
}
