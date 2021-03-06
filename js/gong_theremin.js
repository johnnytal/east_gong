var colorMain = function(game){
	DEVIATION = 2; // how many degrees can you be off (on each side) and still trigger the gong
	
	DEG = Math.PI / 180;
    RAD = 180 / Math.PI;
    
    GONG_HEAD = null; // change to heading number to use absolute direction instead of direction relative to site
    
	POINT = [
		{name: 'Mecca', lat: 21.42, lang: 39.82},
		{name: 'Jerusalem', lat: 31.77, lang: 35.23},
		{name: 'Bodh Gaya', lat: 24.69, lang: 84.99},
		{name: 'Disney World', lat: 28.40, lang: -81.57}
	];
	place = 0;
	
	COLORS = [
		"#FF0EF0", "#FF00E0", "#FF0000", "#FF5000", "#FF8200", "#FFa000",
		"#FFf000", "#fdff00", "#b0ff00", "#00ff10", "#00fff4", "#0094ff",
		"#0054ff", "#0500ff", "#FF0EF0", "#FF00E0"
	];

	head = 180; // initialized for debugging purpses
	angleToSite = head + 180;
	
	lat = 0;
	lang = 0;
};

colorMain.prototype = {
    create: function(){

    	gong = game.add.audio('gong', 1, false);

        compass = this.add.sprite(0, 0, 'zodiac');
        compass.x = game.world.centerX;
        compass.y = game.world.centerY;
        compass.anchor.set(.5, .5);
        compass.angle = head * -1;
        
        arrow = this.add.sprite(0, 0, 'arrow'); // pointing to site
        arrow.x = game.world.centerX;
        arrow.y = game.world.centerY;
        arrow.anchor.set(.5, .5);

        pointArrow = game.add.image(0, 0, 'point'); // showing where the phone is heading to (middle X)
        pointArrow.x = game.world.centerX - pointArrow.width / 2;
        pointArrow.y = compass.y - compass.height / 2;

		instText = game.add.text(10, 10, 'Find the way to:', {font: '32px', fill: 'lightgrey'});
		
		for (x = 0; x < 4; x++){
			btn = game.add.sprite(10 + 210*x, 60 , 'button' + x);
			btn.inputEnabled = true;
			btn.events.onInputDown.add(changeDestination, this);
			btn.scale.set(.9, 1);
		}

        try{
        	window.plugins.insomnia.keepAwake();
    	} catch(e){}
    
        try{
            StatusBar.hide();
        } catch(e){}

  		debugGeo = game.add.text(10, 130, 'geo', {font: '28px', fill: 'lightgrey'});
  		
  		debugHeading = game.add.text(0, 0, '00', {font: '36px', fill: 'white', stroke:'black', strokeThickness: 2});
		debugHeading.x = -7 + game.world.centerX - debugHeading.width / 2;
		debugHeading.y = game.world.centerY - debugHeading.height / 2;


		try{
			window.addEventListener("deviceorientation", compassSuccess, true);
        } catch(e){ 
        	
        }  
        
        window.addEventListener("compassneedscalibration", function(event) {
        	alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
            event.preventDefault();
     	 }, true);
     
		navigator.geolocation.watchPosition(onSuccess, onError);
    }
};

function compassSuccess(heading) {
	head = 360 - (Math.round(heading.alpha));

    compass.angle = head * -1;
    
    colorN = Math.round(head / 26) + 1;

    angleToSite = getDegrees(lat, lang, POINT[place].lat, POINT[place].lang);
	arrow.angle = angleToSite;

	var direction;

	if (angleToSite <= 0){
		direction = 'left';
	}
	else{
		direction = 'right';
	}
	
	debugHeading.text = head;
    debugGeo.text = 'Heading: ' + head +
          			' (' + Math.round(lat * 100) / 100 +
          			'|' + Math.round(lang * 100) / 100 + ')' + '\n' +
          			
          			POINT[place].name + ' is ' + Math.round(Math.abs(angleToSite)) + ' degrees ' + direction +
          			' (' + POINT[place].lat +
          			'|' + POINT[place].lang + ')'; 
    
    if (!gong.isPlaying){
    	try{
    		game.stage.backgroundColor = COLORS[colorN];
    	} catch(e){}
	    
	    if (GONG_HEAD == null){ // using relative to site direction
	    	if (Math.abs(angleToSite) < DEVIATION){
				makeGong();	
			}
		}
		else{ // using absolute direction
	    	if (GONG_HEAD < (head + DEVIATION) && GONG_HEAD > (head - DEVIATION)){
				makeGong();	
			}	
		}
    }
}

function onSuccess(position) { // get your current location to match with the site
	lat = position.coords.latitude;
	lang = position.coords.longitude;   
};

function changeDestination(_this){	
	place_n = _this.key;
	place = place_n.slice(6, 7);
}

function makeGong(){
	gong.play();

	game.stage.backgroundColor = '#ffffff';
	
	bell = game.add.image(675, 150, 'bell');
	
	navigator.vibrate(500);
	
	setTimeout(function(){
		bell.kill();
	}, 5000);
}

function getDegrees(lat1, long1, lat2, long2) { // return the degree of direction from current point to site
    var dLat = (lat2 - lat1) * DEG;
    var dLon = (long2 - long1) * DEG;

    lat1 = lat1 * DEG;
    lat2 = lat2 * DEG;

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    var brng = Math.atan2(y, x) * RAD;

    return brng - head;
}

function compassError(){
    alert('Compass Error!');
}

function onError(error) {
	alert('geolocation Error - ' + error);
}