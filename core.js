/* jshint browser: true */
/* jshint esversion: 6  */

//DEVELOPED BY ZACK TRACZYK

const c = document.getElementById("game");
const ctx = c.getContext("2d");
var w = c.width; //Canvas width
var h = c.height; //Canvas height
var xSelect = true;
var xTest = false; //Main session
var xLevel1 = false;
var time; //game counter
var atime = 0; //attack counter
var ptime = 0; //push attack counter
var rtime = 0; //regenerate counter
var sx = 30; //Player placement x
var sy = 100; //Player placement y
var wx = 50; //Player width
var wy = 50; //Player height
var ssx = 0; //Stage placement x
var ssy = 0; //Stage placement y
var playerColor = '#ffd6cc'; //Player color
var esx = 0; //Enemy object x cordinate
var esy = 0; //Enemy object y cordinate
var ewx = 50; //Enemy object width
var ewy = 50; //Enemy object height
var randNum = 0;
var colors =   ['#ffd6cc', '#ffc2b3', '#ffad99', '#ff9980', '#ff9980']; //Player color strobe
var ecolors =  ['#81ea25', '#6bba27', '#96e84e', '#abf966', '#b9f981']; //Enemy color strobe
var ebcolors = ['#f45642', '#e06757', '#f9543e', '#dd351f', '#ed452f']; //Enemy Boss color strobe
var rDown = false; //Right arrow or D is being pressed
var lDown = false; //Left arrow or A
var uDown = false; //Up arrow or W
var dDown = false; //Down arrow or S
var pause = false;
var attackNorm = false; //Basic attack is being executed (space pressed)
var attackPush = false; //Push attack (Q pressed)
var attackRegen = false; //Regenerate (E pressed)
var r = 5;
var pushDraw = false;
var slisten = true; //True when listen should be called
var enemies; //Enemies array
var items;
var power = 100;
var cool = 0;
var health = 100;
var dead = false;
var score = 0;
var highscore = localStorage.getItem("highscore"); //Highscore stored locally in cookies
var recent = 'right'; //Recent direction moved (right, left, up, down)
var damaging = false;
var speed = 1.5; //Enemy speed
var regeneration = false;
var justRegen = false;
const stageScale = 5;

//LEVEL_TEST
    const test_layer1 = new Image();
        test_layer1.src = "level_test/test_map.png";
    const test_layer2 = new Image();
        test_layer2.src = "level_test/test_map-2nd.png";
    const test_layer3 = new Image();
        test_layer3.src = "level_test/test_map-3rd.png";

//Level 1
    const lvl1_layer1 = new Image();
        lvl1_layer1.src = "level_1/Layer_1.png";
    const lvl1_layer2 = new Image();
        //lvl1_layer2.src = "level_test/test_map-2nd.png";
    const lvl1_layer3 = new Image();
        //lvl1_layer3.src = "level_test/test_map-3rd.png";


/*---------------HELPER FUNCTIONS---------------*/
var random = {
	reg: function(a) {
    	var rand = Math.random() * 10;
    	if (rand - 5 > 0 && a < 60) return a + 0.1;
    	else if (rand - 5 <= 0 && a > 40) return a - 0.1;
    	else return a;
	},

	s: function(a) {
    	var rand = Math.random() * 10;
    	if (rand > 5) return a + 0.2;
    	else return a - 0.2;
	},

	mx: function(a) {
    	var rand = Math.random() * 10;
    	if (rand > 5 && a < w - wx - 10) return a + 0.1;
    	else if (rand <= 5 && a > 10) return a - 0.1;
    	else return a;
	},

	my: function(a) {
    	var rand = Math.random() * 10;
    	if (rand > 5 && a > 10) return a - 0.1;
    	else if (rand <= 5 && a < h - wy - 10) return a + 0.1;
    	else return a;
	},
    
    randomLocation: function(a) {
        if (Math.random() * 10 >= 5) {
            if (Math.random() * 10 >= 5) {
                a.esx = Math.random() * w;
                a.esy = -50 * Math.random() - 20;
            } else {
                a.esx = Math.random() * w;
                a.esy = h + 50 * Math.random() + 20;
            }
        } else {
            if (Math.random() * 10 >= 5) {
                a.esx = -50 * Math.random() - 20;
                a.esy = Math.random() * h;
            } else {
                a.esx = w + 50 * Math.random() + 20;
                a.esy = Math.random() * h;
            }
        }
    }
};

var tracker = {
    edgeDetect: function(dir, posX, posY, WidX, WidY) {
        var imgdata = ctx.getImageData(posX-1,posY-1,1,1);
        var pixColor;
        var p;
        if (dir == 'down'){
            for(p = 0; p < WidX; p++){
                imgdata = ctx.getImageData(posX+p,posY+WidY+2,1,1);
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
            for(p = 0; p < WidY; p++){
                imgdata = ctx.getImageData(posX+WidX+2,sy+p,1,1);
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
            for(p = 0; p < WidX; p++){
                imgdata = ctx.getImageData(posX+p,posY-2,1,1);
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
            for(p = 0; p < WidY; p++){
                imgdata = ctx.getImageData(posX-2,sy+p,1,1);
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
    },
    
    collide: function(){
        if (sx < 0 || sy < 0 || sx + wx > w || sy + wy > h) return true;
    },
    
    touch: {
        enemy: function(e){
            if (((sx <= ssx + e.esx*stageScale && ssx + e.esx*stageScale <= sx + wx) && (sy <= ssy + e.esy*stageScale && ssy + e.esy*stageScale <= sy + wy)) || ((sx <= ssx + e.esx*stageScale + e.ewx && ssx + e.esx*stageScale + e.ewx <= sx + wx) && (sy <= ssy + e.esy*stageScale + e.ewy && ssy + e.esy*stageScale + e.ewy <= sy + wy))) return true;
            return false;
        },
        
        item: function(i){
            var x = ssx + i.ix*stageScale;
            var y = ssy + i.iy*stageScale;
            var wid = 10*stageScale;
            if (((x >= sx && x <= sx + wx) && (y >= sy && y <= sy + wy)) ||
                ((x + wid >= sx && x + wid <= sx + wx) && (y + wid >= sy && y + wid <= sy + wy)) ||
                
                ((x >= sx && x <= sx + wx) && (y + wid >= sy && y + wid <= sy + wy)) ||
                ((x + wid >= sx && x + wid <= sx + wx) && (y >= sy && y <= sy + wy))) return true;
            return false;
        }
    },
    
    inarea: function(){
        //if (((sx - (wx / 2 + r) <= enemy.esx && enemy.esx <= sx + wx + (wx / 2 + r)) && (sy - (wy / 2 + r) <= enemy.esy && enemy.esy <= sy + wy + (wy / 2 + r))) || ((sx <= enemy.esx + enemy.ewx && enemy.esx + enemy.ewx <= sx + wx + (wx / 2 + r)) && (sy <= enemy.esy + enemy.ewy && enemy.esy + enemy.ewy <= sy + wy - (wy / 2 + r)))) return true;
    },
    
    mousePosition:{
        x: 0,
        y: 0,
        
        get: function(event) {
            tracker.mousePosition.x = event.x;
            tracker.mousePosition.y = event.y;
            tracker.mousePosition.x -= c.offsetLeft;
            tracker.mousePosition.y -= c.offsetTop;
        }
    } 
};

function resize() {
    // Lookup the size the browser is displaying the canvas.
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    
    // Check if the canvas is not the same size.
    if (w != cw || h != ch) {
        
        // Make the canvas the same size
        c.width = cw - 18;
        c.height = ch - 22;
        //sx = (sx / w) * c.width;
        //sy = (sy / h) * c.height;
        w = c.width;
        h = c.height;
    }
}
/*----------------------------------------------*/


/*--------------------ITEMS----------------------*/
function ItemPow(x, y, state){
    this.ix = x;
        
    this.iy = y;
    
    this.state = state;
    
    this.draw = function(){
        ctx.fillStyle = '#33cc33';
        ctx.strokeStyle = 'black';
        ctx.fillRect(ssx + this.ix*stageScale,ssy + this.iy*stageScale,10*stageScale,10*stageScale);
        ctx.strokeRect(ssx + this.ix*stageScale,ssy + this.iy*stageScale,10*stageScale,10*stageScale);
    };
    
    this.disappear = function(){
        if(power + 25 <= 100) power+= 25;
        else if(power + 25 > 100) power = 100;
        
        this.state = 'hidden';
    };
    
    this.stateDef = function(){
        if(this.state == 'visible') this.draw();
    };
}
/*-----------------------------------------------*/


/*-------------------CHARACTERS-------------------*/
var character = {

    listen: function() {
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        
        function keyDownHandler(e) {
            e.preventDefault();
            if (e.keyCode == 40 || e.keyCode == 83) dDown = true;
            if (e.keyCode == 39 || e.keyCode == 68) rDown = true;
            if ((e.keyCode == 38 || e.keyCode == 87)) uDown = true;
            if (e.keyCode == 37 || e.keyCode == 65) lDown = true;
            if (e.keyCode == 32 && cool === 0) attackNorm = true;
            else if ((e.keyCode == 81 || e.keyCode == 90) && cool === 0 && power >= 10) attackPush = true;
            else if ((e.keyCode == 69 || e.keyCode == 88)&& cool === 0 && power > 0) attackRegen = true;
        }
        
        function keyUpHandler(e) {
            if (e.keyCode == 40 || e.keyCode == 83) dDown = false;
            if (e.keyCode == 39 || e.keyCode == 68) rDown = false;
            if (e.keyCode == 38 || e.keyCode == 87) uDown = false;
            if (e.keyCode == 37 || e.keyCode == 65) lDown = false;
            if (e.keyCode == 69 || e.keyCode == 88) attackRegen = false;
        }
        
    },
    
    moveChar: function() {
        if(slisten){
            if (dDown && regeneration === false && tracker.edgeDetect('down', sx, sy, wx, wy)) {
                if(sy >= h/2 - wy && (ssy + h*stageScale > h)){
                    ssy -= speed; //Move Background up
                } else {
                    sy += speed;
                    //sx = random.reg(sx);
                }
                recent = 'down';
            }
            if (rDown && regeneration === false && tracker.edgeDetect('right', sx, sy, wx, wy)) {
                if((sx >= w/2-wx) && (ssx + w*stageScale > w)){
                    ssx -= speed; //Move Background left
                } else {
                    sx += speed;
                    //sy = random.reg(sy);
                }
                recent = 'right';
            }
            if (uDown && regeneration === false && tracker.edgeDetect('up', sx, sy, wx, wy)) {
                if(ssy < 0 && sy <= h/2-wy){
                    ssy += speed; //Move Background down
                } else {
                    sy -= speed;
                    //sx = random.reg(sx);
                }
                recent = 'up';
            }
            if (lDown && regeneration === false && tracker.edgeDetect('left', sx, sy, wx, wy)) {
                if(ssx < 0 && sx <= w/2-wx){
                    ssx += speed; //Move Background right
                } else {
                    sx -= speed;
                    //sy = random.reg(sy);
                }
                
                recent = 'left';
            }
        }
        
        if (attackNorm && regeneration === false) {
            character.attack();
        } else if (attackPush && regeneration === false) {
            character.push();
        } else if (attackRegen){
			regeneration = true;
		} else if (attackRegen === false){
        	regeneration = false;
        }
        
		if(regeneration) character.regenerate();
		
        if(tracker.edgeDetect('up', sx, sy, wx, wy) && tracker.edgeDetect('down', sx, sy, wx, wy) && tracker.edgeDetect('left', sx, sy, wx, wy) && tracker.edgeDetect('right', sx, sy, wx, wy)){
            sx = random.s(sx);
            sy = random.s(sy);
            wx = random.reg(wx);
            wy = random.reg(wy);
        }
    },
    
    drawChar: function() {
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
        
        if(pushDraw){
            ctx.beginPath();
            ctx.strokeStyle = playerColor;
            ctx.arc(sx + wx / 2, sy + wy / 2, wx + r, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = 'black';
        }
    },
    
    attack: function(){
        slisten = false;
        playerColor = '#adedff';
        atime++;
        cool += 0.75;
        
        if (atime < 20 && recent == 'right' && tracker.edgeDetect('right', sx, sy, wx, wy)) sx += 3;
        else if (atime < 20 && recent == 'left' && tracker.edgeDetect('left', sx, sy, wx, wy)) sx -= 3;
        else if (atime > 20 && recent == 'left' && tracker.edgeDetect('left', sx, sy, wx, wy)) sx += 3;
        else if (atime > 20 && recent == 'right' && tracker.edgeDetect('right', sx, sy, wx, wy)) sx -= 3;
        
        if (atime < 20 && recent == 'down' && tracker.edgeDetect('down', sx, sy, wx, wy)) sy += 3;
        else if (atime < 20 && recent == 'up' && tracker.edgeDetect('up', sx, sy, wx, wy)) sy -= 3;
        else if (atime > 20 && recent == 'up' && tracker.edgeDetect('up', sx, sy, wx, wy)) sy += 3;
        else if (atime > 20 && recent == 'down' && tracker.edgeDetect('down', sx, sy, wx, wy)) sy -= 3;
        
        enemies.forEach(function(item){
            if (atime == 20 && tracker.touch.enemy(item) && item.state != 'dead') item.state = 'dying';
        });
        
        if(atime == 20 && tracker.touch.enemy(enemy1) && enemy.state != 'dead') enemy1.state = 'dying';
        
        if (atime >= 40) {
            attackNorm = false;
            slisten = true;
            atime = 0;
        } else if (tracker.collide()) {
            //clearInterval(sessionA);
            //shrink();
        }
    },
    
    push: function(){
        slisten = false;
        pushDraw = true;
        playerColor = '#adedff';
        ptime++;
        
        if (ptime <= 28) {
            r -= 0.2;
            cool += 1;
        } else if (ptime >= 32 && ptime < 80 && ptime % 8 === 0) {
            r -= 3;
            cool += 0.75;
        } else if (ptime >= 32 && ptime < 80 && Math.abs(ptime % 8) == 1) {
            r += 3;
            cool += 0.75;
        } else if (80 <= ptime && ptime < 130) {
            enemies.forEach(function(item){
                item.state = 'push';
            });
            
            power -= 0.5;
            r += 4;
            cool += 0.25;
        }
        
        if (ptime >= 200) {
            cool -= 0.5;
            slisten = true;
            ptime = 0;
            r = 5;
            attackPush = false;
            pushDraw = false;
            
            enemies.forEach(function(item){
                item.state = 'alive';
            });
        } /*else if (tracker.collide()) {
            attackPush = false;
            //shrink();

            enemies.forEach(function(item, index, arr){
                arr[index].state = 'alive';
            });
        }*/
    },
    
    regenerate: function(){
		rtime++;
        if(cool == 50){
            justRegen = true;
            
            if(power <= 0){
                regeneration = false;
                attackRegen = false;
            }
            if(rtime % 3 === 0 && power > 0) power-=1;
            if(rtime % 3 === 0 && health < 100) health++;
            if(rtime % 2 === 0){
                wx+=6;
                wy+=6;
                sx-=2;
                sy-=2;
            } else {
                wx-=5;
                wy-=5;
                sx+=2;
                sy+=2;
            }
        } else {
            if(rtime % 2 === 0) cool+=0.25;
        }
    }
};

function enemy(state, type, enemspeed){
    this.state = state; //Spawn, alive, push, dying, or dead
    
    this.type = type; //Regular or boss
    
    this.speed = enemspeed * speed;
    
    this.bossIsAlive = false; //Boss not functional
    
    this.esx = ssx + esx*stageScale;
    
    this.esy = ssy + esy*stageScale;

    this.spawn = function() {
        random.randomLocation(this);
        //this.esx = 50;
        //this.esy = 50;
        this.state = 'alive';
    };

    this.draw = function() {
        ctx.lineWidth = 1;
        const randNum = Math.round(Math.random() * 2);
        const erandomColor = ecolors[randNum];
        ctx.fillStyle = erandomColor;
        
        this.ewx = (wx / 2 - 10)*1.2;
        this.ewy = (wy - 10)*1.2;
        ctx.beginPath();
        
        //Draws Body
        ctx.moveTo(ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale);
        ctx.bezierCurveTo(ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale - this.ewy / 4,
                          ssx + this.esx*stageScale + this.ewx + this.ewx / 8, ssy + this.esy*stageScale - this.ewy / 4,
                          ssx + this.esx*stageScale + this.ewx + this.ewx / 8, ssy + this.esy*stageScale);

        ctx.bezierCurveTo(ssx + this.esx*stageScale + this.ewx * 2, ssy + this.esy*stageScale,
                          ssx + this.esx*stageScale + this.ewx * 2, ssy + this.esy*stageScale + this.ewy,
                          ssx + this.esx*stageScale + this.ewx - this.ewx / 8, ssy + this.esy*stageScale + this.ewy);

        ctx.bezierCurveTo(ssx + this.esx*stageScale + this.ewx - this.ewx / 8, ssy + this.esy*stageScale + this.ewy * 1.75,
                          ssx + this.esx*stageScale - this.ewx * 2, ssy + this.esy*stageScale + this.ewy / 4,
                          ssx + this.esx*stageScale, ssy + this.esy*stageScale + this.ewy / 2);

        ctx.bezierCurveTo(ssx + this.esx*stageScale - this.ewx, ssy + this.esy*stageScale + this.ewy / 2,
                          ssx + this.esx*stageScale - this.ewx / 2, ssy + this.esy*stageScale,
                          ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 1;

        //Draws Left Eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(ssx + this.esx*stageScale + this.ewx / 6, ssy + this.esy*stageScale + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //Draws Right Eye
        ctx.beginPath();
        ctx.arc(ssx + this.esx*stageScale + this.ewx - this.ewx / 8, ssy + this.esy*stageScale + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //Draws Mouth
        ctx.beginPath();
        ctx.moveTo(ssx + this.esx*stageScale + this.ewx / 8, ssy + this.esy*stageScale + this.ewy);
        ctx.bezierCurveTo(ssx + this.esx*stageScale + this.ewy / 8, ssy + this.esy*stageScale + this.ewy - this.ewy /3, ssx + this.esx*stageScale + this.ewx - this.ewy / 8, ssy + this.esy*stageScale + this.ewy - this.ewy /3, ssx + this.esx*stageScale + this.ewx - this.ewy / 8, ssy + this.esy*stageScale + this.ewy);
        ctx.stroke();
        ctx.closePath();
    };

    this.drawBoss = function() {
        ctx.lineWidth = 1;
        randNum = Math.round(Math.random() * 2);
        const ebrandomColor = ebcolors[randNum];
        ctx.fillStyle = ebrandomColor;
        this.ewx = wx - 10;
        this.ewy = wy * 2 - 10;
        ctx.beginPath();

        ctx.moveTo(this.esx - this.esx / 20, this.esy);
        ctx.bezierCurveTo(this.esx - this.esx / 20, this.esy - this.esy / 20, this.esx + this.ewx + this.esx / 20, this.esy - this.esy / 20, this.esx + this.ewx + this.esx / 20, this.esy);

        ctx.bezierCurveTo(this.esx + this.ewx + this.esx / 10, this.esy, this.esx + this.ewx + this.esx / 10, this.esy + this.ewy, this.esx + this.ewx, this.esy + this.ewy);

        ctx.bezierCurveTo(this.esx + this.ewx / 10, this.esy + this.esy / 4, this.esx - this.ewx * 2, this.esy + this.ewy / 4, this.esx - this.esx / 20, this.esy + this.ewy / 2);

        ctx.bezierCurveTo(this.esx - this.ewx / 2, this.esy + this.ewy / 2, this.esx - this.ewx * 2, this.esy + this.ewy / 4, this.esx - this.esx / 20, this.esy);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.esx + this.ewx / 6, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.esx + this.ewy / 8, this.esy + this.ewy);
        ctx.bezierCurveTo(this.esx + this.ewx / 8, this.esy + this.ewy - this.ewy / 3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy - this.ewy / 3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy);
        ctx.stroke();
        ctx.closePath();
    };

    this.move = function() {
        //this.esx = ssx + stageScale;
        //this.esy = ssy + stageScale;
        
        if (ssx + this.esx*stageScale > sx + wx / 10) this.esx -= this.speed;
        if (ssx + this.esx*stageScale < sx + wx / 10) this.esx += this.speed;

        if (ssy + this.esy*stageScale > sy + wy / 10) this.esy -= this.speed;
        if (ssy + this.esy*stageScale < sy + wy / 10) this.esy += this.speed;

        this.esx= random.reg(this.esx);
        this.esy = random.reg(this.esy);
    };

    this.kill = function() {
        this.ewx -= 0.5;
        this.ewy -= 0.5;
        this.esx += 0.1;
        this.esy += 0.1;
		ctx.beginPath();
        
        ctx.fillStyle = 'black';
        //Draws Body
        ctx.moveTo(ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale);
        ctx.bezierCurveTo(ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale - this.ewy / 4,
                          ssx + this.esx*stageScale + this.ewx + this.ewx / 8, ssy + this.esy*stageScale - this.ewy / 4,
                          ssx + this.esx*stageScale + this.ewx + this.ewx / 8, ssy + this.esy*stageScale);

        ctx.bezierCurveTo(ssx + this.esx*stageScale + this.ewx * 2, ssy + this.esy*stageScale,
                          ssx + this.esx*stageScale + this.ewx * 2, ssy + this.esy*stageScale + this.ewy,
                          ssx + this.esx*stageScale + this.ewx - this.ewx / 8, ssy + this.esy*stageScale + this.ewy);

        ctx.bezierCurveTo(ssx + this.esx*stageScale + this.ewx - this.ewx / 8, ssy + this.esy*stageScale + this.ewy * 1.75,
                          ssx + this.esx*stageScale - this.ewx * 2, ssy + this.esy*stageScale + this.ewy / 4,
                          ssx + this.esx*stageScale, ssy + this.esy*stageScale + this.ewy / 2);

        ctx.bezierCurveTo(ssx + this.esx*stageScale - this.ewx, ssy + this.esy*stageScale + this.ewy / 2,
                          ssx + this.esx*stageScale - this.ewx / 2, ssy + this.esy*stageScale,
                          ssx + this.esx*stageScale - this.ewx / 8, ssy + this.esy*stageScale);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (this.ewx <= 0 || this.ewy <= 0) {
            score++;
            if (power < 50) power += 1;
            this.state = 'dead';
            if(this.type == 'boss') this.bossIsAlive = false;
        }
    };

    this.push = function() {
        if(this.type == 'regular')this.draw();
        else if(this.typ == 'boss')this.drawBoss();
        if (tracker.inarea(this)) {
            if (this.esx > sx + wx / 10) this.esx += 6;
            if (this.esx < sx + wx / 10) this.esx -= 6;

            if (this.esy > sy + wy / 10) this.esy += 6;
            if (this.esy < sy + wy / 10) this.esy -= 6;
        } else {
            this.esx = random.s(this.esx);
            this.esy = random.s(this.esy);
        }
    };
        
    this.stateDef = function() {
        if (this.type == 'regular') {
            if (this.state == 'spawn' || this.state == 'dead') {
                this.spawn();
            } else if (this.state == 'alive') {
                if(pause === false) this.move();
                this.draw();
            } else if (this.state == 'dying') {
                this.kill();
            } else if (this.state == 'push') {
                this.push();
            }
        } else if (this.type == 'boss') {
            if (this.state == 'spawn') {
                this.spawn();
            } else if (this.state == 'alive') {
                if(pause === false) this.move();
                this.drawBoss();
            } else if (this.state == 'dying') {
                this.kill();
            } else if (this.state == 'push') {
                this.push();
            }
        }
    };
}

var enemy1 = new enemy('none', 'regular', 0.05);
var enemy2 = new enemy('none', 'regular', 0.05);
var enemy3 = new enemy('none', 'regular', 0.05);
var enemy4 = new enemy('none', 'regular', 0.05);
var enemy5 = new enemy('none', 'regular', 0.05);
var enemy6 = new enemy('none', 'regular', 0.05);
var enemy7 = new enemy('none', 'regular', 0.05);
var enemy8 = new enemy('none', 'regular', 0.05);
//var enemy1 = new enemy('none', 'boss');

enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8];

function stateDefinition(){
    enemies.forEach(function(item){
        item.stateDef();
    });
}

var item1 = new ItemPow(93, 459, 'visible');
var item2 = new ItemPow(200, 400, 'visible');
var item3 = new ItemPow(240, 400, 'visible');
var item4 = new ItemPow(285, 400, 'visible');
var item5 = new ItemPow(400, 230, 'visible');
var item6 = new ItemPow(423, 270, 'visible');
var item7 = new ItemPow(370, 384, 'visible');

items = [item1, item2, item3, item4, item5, item6, item7];

function itemDefinition(){
    items.forEach(function(item){
        item.stateDef();
    });
}

function enemySpawn(){}

function enemeySpeed(){
    if(score >= 20 && score < 40)   speed=1.2;
    if(score >= 40 && score < 80)   speed=1.25;
    if(score >= 80 && score < 100)  speed=1.5;
    if(score >= 100 && score < 200) speed=1.75;
    if(score >= 200 && score < 250) speed=2;
    if(score >= 250 && score < 300) speed=2.5;
    if(score >= 300)                speed=3;
}
/*-----------------------------------------------*/


/*---------------HEADS UP DISPLAY----------------*/
var hud = {
    test:{
        stage: function(layer) {
            switch(layer){
                case 1:
                    ctx.fillStyle = '#fffbf9';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(test_layer1, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                case 2:
                    ctx.drawImage(test_layer2, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                case 3:
                    ctx.drawImage(test_layer3, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                default:
                    ctx.drawImage(test_layer1, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
            }
        },
    },
    
    level_1:{
        stage: function(layer) {
            switch(layer){
                case 1:
                    ctx.fillStyle = '#fffbf9';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(lvl1_layer1, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                case 2:
                    ctx.drawImage(lvl1_layer2, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                case 3:
                    ctx.drawImage(lvl1_layer3, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
                default:
                    ctx.drawImage(lvl1_layer1, ssx, ssy, 2000*stageScale, 2000*stageScale);
                    break;
            }
        }
    },
    
    health: function() {
        ctx.fillStyle = 'black';
        ctx.fillRect(10, 10, w - 20, 20);
        ctx.fillStyle = playerColor;
        ctx.font = "10px monospace";
        ctx.fillText(health + "/100", w / 2 - 15, 23);
        ctx.fillRect(11, 11, (health / 100) * (w - 22), 18);
    },
    
    cool: function() {
        ctx.fillStyle = 'black';
        ctx.fillRect(w / 2, 35, w / 4 - 2.5, 20);
        ctx.fillStyle = 'blue';
        ctx.fillRect(w / 2 + 1, 36, ((50 - cool) / 50) * (w / 4 - 5.25), 18);
    },
    
    power: function() {
        ctx.fillStyle = 'black';
        ctx.fillRect(w * 3 / 4 + 5, 35, w / 4 - 15.5, 20);
        ctx.fillStyle = '#33cc33';
        ctx.font = "10px monospace";
        ctx.fillText(Math.round(power) + "/100", w - w * (1 / 8) - 15, 49);
        ctx.fillRect(w - w * (1 / 4) + 6, 36, (power / 100) * (w / 4 - 17.5), 18);
    },
    
    score: function() {
        ctx.fillStyle = 'black';
        ctx.font = "20px monospace";
        ctx.fillText("Score: " + score, 18, 28, w / 2);
        ctx.fillText("High-Score: " + highscore, 18, 58, w / 2);
    },
    
    full: function() {
        
        hud.health();
        
        hud.power();
        
        hud.cool();
    }
};
/*-----------------------------------------------*/


/*-----------------------SESSIONS------------------------*/
enemies.forEach(function(element){
    element.state = 'spawn';
});
function LevelSession_test(timestamp) {
    ctx.clearRect(0, 0, w, h);
    $('body').css("background", "black");
    resize(c);
    
//Layer bottom
    hud.test.stage(1);
    
    character.listen();
    
    character.moveChar();
//Layer 2nd
    hud.test.stage(2);
    
//Layer 3rd
    stateDefinition();
    
    items.forEach(function(element){
        if(tracker.touch.item(element) && element.state != 'hidden') element.disappear();
    });
    
    itemDefinition();
    
    character.drawChar();
    
    //enemySpawn();
    
//Layer 4th
    hud.test.stage(3);
    
//Layer top
    hud.full();
    
    if (cool > 0 && regeneration === false && attackNorm === false && attackPush === false) {
        cool-= 0.25;
        playerColor = '#adedff';
    }
    
     if (tracker.touch.enemy(enemy1) && attackNorm === false && attackPush === false) {
         health--;
         playerColor = '#ff6d6d';
         damaging = true;
         regeneration = false;
     } else damaging = false;
    
    if (cool === 0 && damaging === false) {
        playerColor = '#ffd6cc';
    }
    
    if (xTest) window.requestAnimationFrame(LevelSession_test);
}

function LevelSelect(timestamp){
    ctx.clearRect(0, 0, w, h);
    
    resize(c);
    
    c.addEventListener("mousedown", tracker.mousePosition.get, false);
    
    if(w >= 1000){
        //big corners
        ctx.fillStyle = 'black';
        ctx.fillRect(5, 5, 30, 100);
        ctx.fillRect(5, 5, 100, 30);
        
        ctx.fillRect(5, h - 105, 30, 100);
        ctx.fillRect(5, h - 35, 100, 30);
        
        ctx.fillRect(w - 105, 5, 100, 30);
        ctx.fillRect(w - 35, 5, 30, 100);
        
        ctx.fillRect(w - 105, h - 35, 100, 30);
        ctx.fillRect(w - 35, h - 105, 30, 100);
        
        //levels
            //Left
        ctx.fillStyle = '#ffd6cc';
        ctx.strokeStyle = 'black';
		
		ctx.strokeRect(w/2 - 495, h/2 - 155, 310, 310);
		ctx.strokeRect(w/2 - 500, h/2 - 160, 320, 320);
        ctx.fillRect(w/2 - 490, h/2 - 150, 300, 300);
		
		ctx.fillStyle = '#fff9fc';
		ctx.beginPath();
		ctx.moveTo(w/2 - 505, h/2 - 165);
		ctx.lineTo(w/2 - 465, h/2 - 165);
		ctx.lineTo(w/2 - 505, h/2 - 130);
		ctx.lineTo(w/2 - 505, h/2 - 165);
		
		ctx.moveTo(w/2 - 175, h/2 - 165);
		ctx.lineTo(w/2 - 220, h/2 - 165);
		ctx.lineTo(w/2 - 175, h/2 - 130);
		ctx.lineTo(w/2 - 175, h/2 - 165);
		
		ctx.moveTo(w/2 - 505, h/2 + 165);
		ctx.lineTo(w/2 - 460, h/2 + 165);
		ctx.lineTo(w/2 - 505, h/2 + 130);
		ctx.lineTo(w/2 - 505, h/2 + 165);

		ctx.moveTo(w/2 - 175, h/2 + 165);
		ctx.lineTo(w/2 - 220, h/2 + 165);
		ctx.lineTo(w/2 - 175, h/2 + 130);
		ctx.lineTo(w/2 - 175, h/2 + 165);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
            //Center
		ctx.fillStyle = '#ffd6cc';
        ctx.strokeRect(w/2 - 155, h/2 - 155, 310, 310);
        ctx.strokeRect(w/2 - 160, h/2 - 160, 320, 320);
        ctx.fillRect(w/2 - 150, h/2 - 150, 300, 300);
        
        ctx.fillStyle = '#fff9fc';
        ctx.beginPath();
        ctx.moveTo(w/2 - 165, h/2 - 165);
        ctx.lineTo(w/2 - 120, h/2 - 165);
        ctx.lineTo(w/2 - 165, h/2 - 130);
        ctx.lineTo(w/2 - 165, h/2 - 165);
        
        ctx.moveTo(w/2 + 165, h/2 - 165);
		ctx.lineTo(w/2 + 120, h/2 - 165);
		ctx.lineTo(w/2 + 165, h/2 - 130);
		ctx.lineTo(w/2 + 165, h/2 - 165);
		
		ctx.moveTo(w/2 - 165, h/2 + 165);
        ctx.lineTo(w/2 - 120, h/2 + 165);
        ctx.lineTo(w/2 - 165, h/2 + 130);
        ctx.lineTo(w/2 - 165, h/2 + 165);
        
        ctx.moveTo(w/2 + 165, h/2 + 165);
		ctx.lineTo(w/2 + 120, h/2 + 165);
		ctx.lineTo(w/2 + 165, h/2 + 130);
		ctx.lineTo(w/2 + 165, h/2 + 165);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
            //Right
        ctx.fillStyle = '#ffd6cc';
        ctx.strokeRect(w/2 + 185, h/2 - 155, 310, 310);
        ctx.strokeRect(w/2 + 180, h/2 - 160, 320, 320);
        ctx.fillRect(w/2 + 190, h/2 - 150, 300, 300);
        
        ctx.fillStyle = '#fff9fc';
		ctx.beginPath();
		ctx.moveTo(w/2 - 505, h/2 - 165);
		ctx.lineTo(w/2 - 465, h/2 - 165);
		ctx.lineTo(w/2 - 505, h/2 - 130);
		ctx.lineTo(w/2 - 505, h/2 - 165);
		
		ctx.moveTo(w/2 - 175, h/2 - 165);
		ctx.lineTo(w/2 - 220, h/2 - 165);
		ctx.lineTo(w/2 - 175, h/2 - 130);
		ctx.lineTo(w/2 - 175, h/2 - 165);
		
		ctx.moveTo(w/2 - 505, h/2 + 165);
		ctx.lineTo(w/2 - 460, h/2 + 165);
		ctx.lineTo(w/2 - 505, h/2 + 130);
		ctx.lineTo(w/2 - 505, h/2 + 165);

		ctx.moveTo(w/2 - 175, h/2 + 165);
		ctx.lineTo(w/2 - 220, h/2 + 165);
		ctx.lineTo(w/2 - 175, h/2 + 130);
		ctx.lineTo(w/2 - 175, h/2 + 165);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		
        
		/* test
        ctx.fillStyle = 'black';
        ctx.font = "50px monospace";
        ctx.fillText(tracker.mousePosition.x + " " + tracker.mousePosition.y, 20, 60);
        */
		
        //Select Tracker
        if(tracker.mousePosition.x > w / 2 - 480 && tracker.mousePosition.x < w / 2 - 180){
            xSelect = false;
            window.cancelAnimationFrame(LevelSelect);
            xTest = true;
            window.requestAnimationFrame(LevelSession_test);
        }
    } else {
        //corners
        ctx.fillStyle = 'black';
        ctx.fillRect(5, 5, 10, 35);
        ctx.fillRect(5, 5, 35, 10);
        
        ctx.fillRect(5, h - 40, 10, 35);
        ctx.fillRect(5, h - 15, 35, 10);
        
        ctx.fillRect(w - 40, 5, 35, 10);
        ctx.fillRect(w - 15, 5, 10, 35);
        
        ctx.fillRect(w - 40, h - 15, 35, 10);
        ctx.fillRect(w - 15, h - 40, 10, 35);
        
        //levels
        ctx.fillStyle = '#ffd6cc';
        
        ctx.fillRect(w/2 - 125, h/2 - 405, 250, 250);
        
        ctx.fillRect(w/2 - 125, h/2 - 125, 250, 250);
        
        ctx.fillRect(w/2 - 125, h/2 + 155, 250, 250);
    }
    
    if (xSelect) window.requestAnimationFrame(LevelSelect);
}

function LevelSession_one(timestamp) {
    ctx.clearRect(0, 0, w, h);
    $('body').css("background", "black");
    resize(c);
    
//Layer bottom
    hud.level_1.stage(1);
    
    character.listen();
    
    character.moveChar();
    
//Layer 2nd
    hud.level_1.stage(2);
    
//Layer 3rd
    stateDefinition();
    
    items.forEach(function(element){
        if(tracker.touch.item(element) && element.state != 'hidden') element.disappear();
    });
    
    itemDefinition();
    
    character.drawChar();
    
    //enemySpawn();
    
//Layer 4th
    hud.level_1.stage(3);
    
//Layer top
    hud.full();
    
    if (cool > 0 && regeneration === false && attackNorm === false && attackPush === false) {
        cool-= 0.25;
        playerColor = '#adedff';
    }
    
     if (tracker.touch.enemy(enemy1) && attackNorm === false && attackPush === false) {
            health--;
            playerColor = '#ff6d6d';
            damaging = true;
            regeneration = false;
     } else {
         damaging = false;
     }
    
    if (cool === 0 && damaging === false) {
        playerColor = '#ffd6cc';
    }
    
    if (xLevel1) window.requestAnimationFrame(LevelSession_one);
}
/*-----------------------------------------------*/
