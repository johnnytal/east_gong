var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.audio('gong', 'assets/audio/gong.ogg');
        
        game.load.image('bell', 'assets/images/bell.jpg');
        game.load.image('zodiac', 'assets/images/zodiac.png');
        game.load.image('arrow', 'assets/images/arrow.png');
        game.load.image('point', 'assets/images/point.png');
    },
    
    create: function(){
        this.game.state.start("Color"); 
    }
};