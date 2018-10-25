class Menu extends Phaser.scene {
    constructor(){
        super({key:"Menu"});
    }
    
    preload(){
        this.load.image('test','level_test/test_map.png');
    }
    
    create(){
        this.image = this.add.image(400,300,'test');
    }
    
    update(delta){}
}