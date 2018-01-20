
Spry.Utils.addLoadListener(function() {

		var c = document.getElementById("game");
		var ctx = c.getContext("2d");
		var x = 0;
		var y = 0;
		
		function random(a) {
    var rand = Math.random() * 10;
    if (rand - 5 > 0 && a < 60) {
        return a + 1;
    } else if (rand - 5 <= 0 && a > 40) {
        return a - 1;
    } else {
        return a;
    }
}

function srandom(a) {
    var rand = Math.random() * 10
    if (rand > 5) {
        return a + 1;

    } else {
        return a - 1;
    }
}


function mxrandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5 && a < w - wx - 10) {
        return a + 1;

    } else if (rand <= 5 && a > 10) {
        return a - 1;
    } else {
        return a;
    }
}


function myrandom(a) {
    var rand = Math.random() * 10
    if (rand > 5 && a > 10) {
        return a - 1;

    } else if (rand <= 5 && a < h - wy - 10) {
        return a + 1;
    } else {
        return a;
    }
}
		function main(timestamp){
			x++;
			y++;
			ctx.fillRect(x,y,20,20);
			
			window.requestAnimationFrame(main);
		}
		
		window.requestAnimationFrame(main);
	

});
