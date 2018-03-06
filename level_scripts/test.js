/* jshint browser: true */
/* jshint esversion: 6  */

const c = document.getElementById("game");
const ctx = c.getContext("2d");
var xMain = true; //Main session
var sx = 30; //Player placement x
var sy = 100; //Player placement y
var wx = 50; //Player width
var wy = 50; //Player height
var ssx = 0; //Stage placement x
var ssy = 0; //Stage placement y
var w = c.width; //Canvas width
var h = c.height; //Canvas height
var playerColor = '#ffd6cc'; //Player color
var rDown = false; //Right arrow or D is being pressed
var lDown = false; //Left arrow or A
var uDown = false; //Up arrow or W
var dDown = false; //Down arrow or S
var attackb = false; //Basic attack is being executed (space pressed)
var attackz = false; //Push attack (Q pressed)
var attackx = false; //Regenerate (E pressed)
var power = 50;
var cool = 0;
var health = 100;
var dead = false;
var score = 0;
var highscore = localStorage.getItem("highscore"); //Highscore stored locally in cookies
var recent = 'right'; //Recent direction moved (right, left, up, down)
var damaging;
var speed = 1.5; //Enemy speed
var regeneration = false;
const background = new Image(); //Level map
background.src = "level_maps/test_map.png";
const stageScale = 5;

//HELPER FUNCTIONS
function random(a) {
    var rand = Math.random() * 10;
    if (rand - 5 > 0 && a < 60) return a + 0.5;
    else if (rand - 5 <= 0 && a > 40) return a - 0.5;
    else return a;
}

function srandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5) return a + 0.2;
    else return a - 0.2;
}

function mxrandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5 && a < w - wx - 10) return a + 0.1;
    else if (rand <= 5 && a > 10) return a - 0.1;
    else return a;
}

function myrandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5 && a > 10) return a - 0.1;
    else if (rand <= 5 && a < h - wy - 10) return a + 0.1;
    else return a;
}

function resize() {
    // Lookup the size the browser is displaying the canvas.
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    
    // Check if the canvas is not the same size.
    if (w != cw || h != ch) {
        
        // Make the canvas the same size
        c.width = cw - 18;
        c.height = ch - 22;
        sx = (sx / w) * c.width;
        sy = (sy / h) * c.height;
        w = c.width;
        h = c.height;
    }
}

//CHARACTER
function edgeDetect(dir) {
    var imgdata = ctx.getImageData(sx-1,sy-1,1,1);
    var pixColor;
    var p;
    if (dir == 'down'){
        for(p = 0; p < wx; p++){
            imgdata = ctx.getImageData(sx+p,sy+wy+2,1,1);
            pixColor = "rgba(" + imgdata.data[0] + ","  + imgdata.data[1] + ","+ imgdata.data[2] + ","+ imgdata.data[3] + ")";
            if(pixColor == "rgba(0,0,0,255)"){
                /*
                    Detection test
                ctx.fillStyle = "red";
                ctx.fillRect(20, 40, 20, 20);
                ctx.fillText(pixColor, 20, 90 + p*5);
                */
                
                return false;
            }
        }
    } else if(dir == 'right'){
        for(p = 0; p < wy; p++){
            imgdata = ctx.getImageData(sx+wx+2,sy+p,1,1);
            pixColor = "rgba(" + imgdata.data[0] + ","  + imgdata.data[1] + ","+ imgdata.data[2] + ","+ imgdata.data[3] + ")";
            if(pixColor == "rgba(0,0,0,255)"){
                /*
                    Detection test
                ctx.fillStyle = "red";
                ctx.fillRect(120, 40, 20, 20);
                ctx.fillText(pixColor, 120, 90 + p*5);
                */
                
                return false;
            }
        }
    } else if(dir == 'up'){
        for(p = 0; p < wx; p++){
            imgdata = ctx.getImageData(sx+p,sy-2,1,1);
            pixColor = "rgba(" + imgdata.data[0] + ","  + imgdata.data[1] + ","+ imgdata.data[2] + ","+ imgdata.data[3] + ")";
            if(pixColor == "rgba(0,0,0,255)"){
                /*
                    Detection test
                ctx.fillStyle = "red";
                ctx.fillRect(220, 40, 20, 20);
                ctx.fillText(pixColor, 220, 90 + p*5);
                */
                
                return false;
            }
        }
    } else if(dir == 'left'){
        for(p = 0; p < wy; p++){
            imgdata = ctx.getImageData(sx-2,sy+p,1,1);
            pixColor = "rgba(" + imgdata.data[0] + ","  + imgdata.data[1] + ","+ imgdata.data[2] + ","+ imgdata.data[3] + ")";
            if(pixColor == "rgba(0,0,0,255)"){
                /*
                    Detection test
                ctx.fillStyle = "red";
                ctx.fillRect(320, 40, 20, 20);
                ctx.fillText(pixColor, 320, 90 + p*5);
                */
                
                return false;
            }
        }
    }
    
    return true;
}

function listen() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    
    function keyDownHandler(e) {
        e.preventDefault();
        if (e.keyCode == 40 || e.keyCode == 83) dDown = true;
        if (e.keyCode == 39 || e.keyCode == 68) rDown = true;
        if ((e.keyCode == 38 || e.keyCode == 87)) uDown = true;
        if (e.keyCode == 37 || e.keyCode == 65) lDown = true;
        if (e.keyCode == 32 && cool === 0) attackb = true;
        else if (e.keyCode == 90 && cool === 0 && power >= 10) attackz = true;
        else if (e.keyCode == 88 && cool === 0 && power > 0) attackx = true;
    }
    
    function keyUpHandler(e) {
        if (e.keyCode == 40 || e.keyCode == 83) dDown = false;
        if (e.keyCode == 39 || e.keyCode == 68) rDown = false;
        if (e.keyCode == 38 || e.keyCode == 87) uDown = false;
        if (e.keyCode == 37 || e.keyCode == 65) lDown = false;
        if (e.keyCode == 88) attackx = false;
    }
    
}

function moveChar() {
    if (dDown && regeneration === false && edgeDetect('down')) {
        if(sy >= h/2 - wy && (ssy + h*stageScale > h)){
            ssy -= speed; //Move Background up
        } else {
            sy += speed;
            //sx = random(sx);
        }
        recent = 'down';
    }
    if (rDown && regeneration === false && edgeDetect('right')) {
        if((sx >= w/2-wx) && (ssx + w*stageScale > w)){
            ssx -= speed; //Move Background left
        } else {
            sx += speed;
            //sy = random(sy);
        }
        recent = 'right';
    }
    if (uDown && regeneration === false && edgeDetect('up')) {
        if(ssy < 0 && sy <= h/2-wy){
            ssy += speed; //Move Background down
        } else {
            sy -= speed;
            //sx = random(sx);
        }
        recent = 'up';
    }
    if (lDown && regeneration === false && edgeDetect('left')) {
        if(ssx < 0 && sx <= w/2-wx){
            ssx += speed; //Move Background right
        } else {
            sx -= speed;
            //sy = random(sy);
        }
        
        recent = 'left';
    }
    /*if (attackb && regeneration == false) {
    clearInterval(sessionM);
    attack();
    } else if (attackz && regeneration == false) {
    clearInterval(sessionM);
    attackZ();
    } else if (attackx == false){
    regeneration = false;
    }
    */
    if(edgeDetect('up') && edgeDetect('down') && edgeDetect('left') && edgeDetect('right')){
        sx = srandom(sx);
        sy = srandom(sy);
        wx = random(wx);
        wy = random(wy);
    }
    
}

function drawChar() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(sx, sy, wx, wy);
    
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.fillStyle = 'black';
    //Right Eye
    ctx.arc(sx + wx / 6, sy + wy / 6, (wx / 4 + wy / 4) / 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    
    //Left Eye
    ctx.beginPath();
    ctx.arc(sx + wx - wx / 8, sy + wy / 6, (wx / 4 + wy / 4) / 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    
    //Smile
    ctx.beginPath();
    ctx.moveTo(sx + wx / 8, sy + wy - wy / 4);
    //ctx.moveTo(sx + wx / 8, sy + wy - wy / 3);
    ctx.bezierCurveTo(sx + wy / 8, sy + wy / 2, sx + wx - wy / 8, sy + wy / 2, sx + wx - wy / 8, sy + wy - wy / 4);
    ctx.stroke();
    ctx.closePath();
}

function drawStage() {
    ctx.fillStyle = '#fffbf9';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(background, ssx, ssy, w*stageScale, h*stageScale);
}

function drawHealth() {
    ctx.fillStyle = 'black';
    ctx.fillRect(10, 10, w - 20, 20);
    ctx.fillStyle = playerColor;
    ctx.font = "10px monospace";
    ctx.fillText(health + "/100", w / 2 - 15, 23);
    ctx.fillRect(11, 11, (health / 100) * (w - 22), 18);
}

function drawCool() {
    ctx.fillStyle = 'black';
    ctx.fillRect(w / 2, 35, w / 4 - 2.5, 20);
    ctx.fillStyle = 'blue';
    ctx.fillRect(w / 2 + 1, 36, ((50 - cool) / 50) * (w / 4 - 5.25), 18);
}

function drawPower() {
    ctx.fillStyle = 'black';
    ctx.fillRect(w * 3 / 4 + 5, 35, w / 4 - 15.5, 20);
    ctx.fillStyle = '#33cc33';
    ctx.font = "10px monospace";
    ctx.fillText(power + "/50", w - w * (1 / 8) - 15, 49);
    ctx.fillRect(w - w * (1 / 4) + 6, 36, (power / 50) * (w / 4 - 17.5), 18);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = "20px monospace";
    ctx.fillText("Score: " + score, 18, 28, w / 2);
    ctx.fillText("High-Score: " + highscore, 18, 58, w / 2);
}

function drawHUD(){
    
    drawHealth();
    
    drawPower();
    
    drawCool();
}

function main(timestamp) {
    ctx.clearRect(0, 0, w, h);
    
    resize(c);
    
    drawStage();
    
    edgeDetect('up');
    
    drawHUD();
    
    listen();
    
    moveChar();
    
    drawChar();
    
    if (xMain) window.requestAnimationFrame(main);
}