/* jshint browser: true */
/* jshint esversion: 6  */
/*globals $:false */

//DEVELOPED BY ZACK TRACZYK

var config = {
    width: 500,
    height: 500,
    fps: 60,
    title: "Blob Mob, The Whole Story",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 200}
        }
    },
    
    scene: [Menu]
};

var game = new Phaser.game(config);