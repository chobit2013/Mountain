var viewWidth, viewHeight, renderer, stage, address;
var loader;
var background, foreground, foregroundTex, hills, hillsTex, rocks1, rocks1Tex, rocks2, rocks2Tex, colorFilter, brightnessFilter, sun, moon, cloud, paralaxContainer, starParticles;

var speed = 0.2;
var hue = 0;
var hueSpeed = 0.08;
var nightHue = 280;
var springHue = -20;
var springBrightness = 1;
var forestHue = 90;
var forestBrightness = 0.8;
var autumnHue = 60;
var autumnBrightness = 0.8;
var winterHue = 220;
var winterBrightness = 1;
var foggyHue = 180;
var foggyBrightness = 0.5;
var halloweenHue = 300;
var halloweenBrightness = 0.4;
var summerHue = 0;
var summerBrightness = 1.1;
var baseHue = 0;
var baseBrightness = 1;
var day = true;
var sunShowing = true;
var sunHeightPerc = 0.45;
var moonHeightPerc = 1;
var lastTime = Date.now();
var starCount = 1000;
var stars = [];
var autoScroll = true;
var mouse = {x:0, y:0 }
var colorToggleValue = 0;

function init(){
	preload();
}

function preload(){

	var address = "http://www.testomic.com/public/codepen-assets/img/paralax/";
	loader = new PIXI.loaders.Loader(); // you can also create your own if you want
	loader.add('background', address + "background-nosun.jpg");
	loader.add('star', address + "star.png");
	loader.add('sun', address + "sun.png");
	loader.add('moon', address + "moon.png");
	loader.add('cloud', address + "cloud.png");
	loader.add('foreground', address + "foreground.png");
	loader.add('hills', address + "hills.png");
	loader.add('rocks1', address + "rocks1.png");
	loader.add('rocks2', address + "rocks2.png");
	loader.once('complete',onAssetsLoaded);
	loader.load();
}

function onAssetsLoaded(){
	
	renderer = PIXI.autoDetectRenderer(viewWidth, viewHeight);
	$(".spring").append(renderer.view);

	stage = new PIXI.Container();
	background =  new PIXI.Sprite(loader.resources.background.texture);
	background.anchor.set(0.5,0.5);
	
	paralaxContainer = new PIXI.Container();
	
	foreground = new PIXI.extras.TilingSprite(loader.resources.foreground.texture, renderer.width, renderer.height);
	
	hills = new PIXI.extras.TilingSprite(loader.resources.hills.texture, renderer.width, renderer.height);
	
	rocks1 = new PIXI.extras.TilingSprite(loader.resources.rocks1.texture, renderer.width, renderer.height);
	
	rocks2 = new PIXI.extras.TilingSprite(loader.resources.rocks2.texture, renderer.width, renderer.height);
	
	sun = new PIXI.Sprite(loader.resources.sun.texture);
	sun.anchor.set(0.5,0.5);
	
	moon = new PIXI.Sprite(loader.resources.moon.texture);
	moon.anchor.set(0.5,0.5);
	
	cloud = new PIXI.Sprite(loader.resources.cloud.texture);
	cloud.anchor.set(0.5,0.5);
	
	colorFilter = new PIXI.filters.ColorMatrixFilter();
	brightnessFilter = new PIXI.filters.ColorMatrixFilter();
	
	background.filters = [colorFilter, brightnessFilter];
	paralaxContainer.filters = [colorFilter, brightnessFilter];
	
	starParticles = new PIXI.particles.ParticleContainer(10000, {
			scale: true,
			position: true,
			rotation: true,
			uvs: true,
			alpha: true
	});	
	
	for(var i = 0; i < starCount; i++){
			var star = new PIXI.Sprite(loader.resources.star.texture);
			star.anchor.set(0.5,0.5);
			var rand = Math.random();
			star.scale.set(0.5*rand,0.5*rand);
			star.x = Math.random() * viewWidth;
    	star.y = Math.random() * viewHeight;
			star.alpha = Math.random();
			star.rotation = 360 * Math.random();
			stars.push(star);
			starParticles.addChild(star);
	}
	starParticles.alpha = 0;
	
	stage.addChild(background);
	stage.addChild(starParticles);
	stage.addChild(sun);
	stage.addChild(moon);
	stage.addChild(paralaxContainer);
	paralaxContainer.addChild(cloud);
	paralaxContainer.addChild(rocks2);
	paralaxContainer.addChild(rocks1);
	paralaxContainer.addChild(hills);
	paralaxContainer.addChild(foreground);
	
	$(window).resize(resize);
	resize();
	
	animate();
	checkToggle();
	
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('touchmove', onTouchMove, false);
	setSeason();
}

function checkToggle(){
	$('#dayToggle').change( function() {
			
			if($("#dayToggle:checked").val() === "on"){
				$(".daySwitch p").text("Night");
				$(".daySwitch .slider").css("background", "#5c145d");
				day = false;
			}
			else{
				$(".daySwitch p").text("Day");
				$(".daySwitch .slider").css("background", "#E14658");
				day = true;
			}

	});
	
	$('#movingToggle').change( function() {

			if($("#movingToggle:checked").val() === "on"){
				$(".movingSwitch p").text("Mouse");
				$(".movingSwitch .slider").css("background", "#5c145d");
				autoScroll = false;
			}
			else{
				$(".movingSwitch p").text("Auto");
				$(".movingSwitch .slider").css("background", "#E14658");
				autoScroll = true;
			}

	});
	
	$('#colorToggle').change( function() {
			
		colorToggleValue = colorToggleValue < 6 ? colorToggleValue+1 : 0;
		
		setSeason();
	});
}

function setSeason(){
	switch(colorToggleValue){
			case 0:
				$(".colorSwitch p").text("Summer");
				$(".colorSwitch .slider").css("background", "#f5cb06");
				hue = baseHue = summerHue;
				baseBrightness = summerBrightness;
				sunHeightPerc = 0.4;
				day = true;
			break;
			case 1:
				$(".colorSwitch p").text("Spring");
				$(".colorSwitch .slider").css("background", "#E14658");
				hue = baseHue = springHue;
				baseBrightness = springBrightness;
				day = true;
				sunHeightPerc = 0.45;
			break;
			case 2:
				$(".colorSwitch p").text("Forest");
				$(".colorSwitch .slider").css("background", "#66b46f");
				hue = baseHue = forestHue;
				baseBrightness = forestBrightness;
				day = true;
				sunHeightPerc = 0.5;
			break;
			case 3:
				$(".colorSwitch p").text("Autumn");
				$(".colorSwitch .slider").css("background", "#6d7738");
				hue = baseHue = autumnHue;
				baseBrightness = autumnBrightness;
				day = true;
				sunHeightPerc = 0.55;
			break;
			case 4:
				$(".colorSwitch p").text("Winter");
				$(".colorSwitch .slider").css("background", "#12f6ea");
				hue = baseHue = winterHue;
				baseBrightness = winterBrightness;
				day = true;
			break;
			case 5:
				$(".colorSwitch p").text("Fog");
				$(".colorSwitch .slider").css("background", "#444444");
				hue = baseHue = foggyHue;
				baseBrightness = foggyBrightness;
				day = true;
			break;
			case 6:
				$(".colorSwitch p").text("Pumpkin");
				$(".colorSwitch .slider").css("background", "#7912c8");
				hue = baseHue = halloweenHue;
				baseBrightness = halloweenBrightness;
				day = true;
			break;
				
		}
}

function resize(){
	
	viewWidth = $(".spring").width();
	viewHeight = $(".spring").height();
	
	for(var i = 0; i < stars.length; i++){
			var star = stars[i];
			star.x = Math.random() * viewWidth;
			star.y = Math.random() * viewHeight;
	}
	
	if(renderer){
		renderer.resize(viewWidth, viewHeight);
	}
	
	if(background){	
		
		background.width = viewWidth;
		background.height = viewHeight;
		background.position.set(viewWidth*0.5, viewHeight*0.5);
		
		fitRectIntoBounds(sun, {width:viewWidth*0.4, height:viewHeight*0.4});
		fitRectIntoBounds(moon, {width:viewWidth*0.4, height:viewHeight*0.4});
		fitRectIntoBounds(cloud, {width:viewWidth*0.8, height:viewHeight*0.25});
		
	}
	
	if(foreground){
			resizeParalaxLayer(loader.resources.foreground.texture, foreground, 0.3, viewHeight);
	}
	
	if(hills){
		var y = viewHeight - (foreground.height*0.45);
		resizeParalaxLayer(loader.resources.hills.texture, hills, 0.3, y);
	}
	
	if(rocks1){
		var y = hills.y - (hills.height*0.2);
		resizeParalaxLayer(loader.resources.rocks1.texture, rocks1, 0.3, y);
	}
	
	if(rocks2){
		var y = rocks1.y + (rocks1.height * 0.5);
		resizeParalaxLayer(loader.resources.rocks2.texture, rocks2, 0.3, y);
	}
}

function fitRectIntoBounds(sprite, bounds) {
  var rectRatio = sprite.width / sprite.height;
  var boundsRatio = bounds.width / bounds.height	;

  var newDimensions = {};

  // Rect is more landscape than bounds - fit to width
  if(rectRatio > boundsRatio) {
    newDimensions.width = bounds.width;
    newDimensions.height = sprite.height * (bounds.width / sprite.width);
  }
  // Rect is more portrait than bounds - fit to height
  else {
    newDimensions.width = sprite.width * (bounds.height / sprite.height);
    newDimensions.height = bounds.height;
  }

  sprite.width = newDimensions.width;
	sprite.height = newDimensions.height;
}

function resizeParalaxLayer(tex, sprite, heightPerc, y){
	
	var texHeight = tex.frame.height;
	sprite.height = texHeight * heightPerc;
	sprite.width = viewWidth;
	sprite.anchor.set(0,1);
	sprite.position.y = y;
	sprite.tileScale.set(heightPerc,heightPerc);
	sprite.tilePosition.set(0,texHeight * heightPerc);
}

function animate(){

	var now = new Date().getTime(),
  dt = now - (lastTime || now);
 	lastTime = now;
	
	var s = speed * dt;
	var hs = hueSpeed * dt;
	
	renderer.render(stage);
	requestAnimationFrame( animate );
	
	if(autoScroll){
		foreground.tilePosition.x -= s;
	}
	else{
		foreground.tilePosition.x = (mouse.x * viewWidth) * 0.5;
	}
	
	if(autoScroll){
		hills.tilePosition.x -= s * 0.5;
	}
	else{
		hills.tilePosition.x = (mouse.x * viewWidth) * 0.25;
	}
	
	if(autoScroll){
		rocks1.tilePosition.x -= s * 0.25;
	}
	else{
		rocks1.tilePosition.x = (mouse.x * viewWidth) * 0.125;
	}
	
	if(autoScroll){
		rocks2.tilePosition.x -= s * 0.125;
	}
	else{
		rocks2.tilePosition.x = (mouse.x * viewWidth) * 0.051;
	}
	
	if(!day){
		hideSun();
		if(hue < nightHue){
			hue += hs;	
		}
	}
	else{
		showSun();
		if(hue > baseHue){
			hue -= hs;
		}
	}

	var brightnessPerc = baseHue == summerHue ? (1.2 - hue/nightHue) : baseBrightness;
	brightnessPerc =  brightnessPerc > 1 ? 1 : brightnessPerc;

	colorFilter.hue(hue, false);
	brightnessFilter.brightness(brightnessPerc, false);
	
	sun.position.set(viewWidth * 0.5, viewHeight * sunHeightPerc);
	moon.position.set(viewWidth * 0.5, viewHeight * moonHeightPerc);
	cloud.position.set(viewWidth * 0.5, viewHeight * 0.55);
}

function hideSun(){
	if(sunShowing){
		sunShowing = false;
		
		var animation = new TimelineLite()
		animation.to(this, 2, {sunHeightPerc:1, ease:Back.easeIn})
             .to(this, 5, {moonHeightPerc:0.45, ease:Back.easeOut});
		
		TweenLite.to(starParticles, 2, {alpha:0.5, delay:3});
	}
}

function showSun(){
	if(!sunShowing){
		sunShowing = true;
		
		var animation = new TimelineLite()
		animation.to(this, 2, {moonHeightPerc:1, ease:Back.easeIn})
             .to(this, 5, {sunHeightPerc:0.45, ease:Back.easeOut});

		TweenLite.to(starParticles, 2, {alpha:0});
	}
}

function onMouseMove(e){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onTouchMove(e) {

	if (e.touches.length === 1) {
		mouse.x = ( e.touches[0].pageX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.touches[0].pageY / window.innerHeight ) * 2 + 1;
	}
}

$( document ).ready(function() {
	init();
});
  
  
  
