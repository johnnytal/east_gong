var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.audio('gong', 'assets/audio/gong.ogg');
        
        game.load.image('bell', 'assets/images/bell.png');
        game.load.image('zodiac', 'assets/images/zodiac.png');
        game.load.image('arrow', 'assets/images/arrow2.png');
        game.load.image('point', 'assets/images/point.png');
        
        game.load.image('button0', 'assets/images/button3.png');
        game.load.image('button1', 'assets/images/button2.png');
        game.load.image('button2', 'assets/images/button1.png');
        game.load.image('button3', 'assets/images/button0.png');
    },
    
    create: function(){
        this.game.state.start("Color"); 
    }
};