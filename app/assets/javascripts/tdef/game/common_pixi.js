/*
//add perv stats on screen
function showStats(place){
	if (!stats)
		return;
	stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb
	// align top-left
	placeStats(place)

	document.body.appendChild( stats.domElement );
}

function placeStats(place){
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = (place.x || place.left) + 'px';
	stats.domElement.style.top = ((place.y+place.height) || place.bottom) - 50 + 'px';	
}
*/

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

var current_time=Date.now;

var getEngine=function (){
	return;
}

var getFPSms=function (){
//  console.log("fps "+statsFps())
	return statsFps()/1000;//1/getEngine().frameTime; 
}

var getFrameTime=function (){
	return 1000/statsFps();
}

var setEngine=function (e){
	var engine=e;
	getEngine=function (){
		return engine;
	}
}

function clone(obj){
	if (obj)
		return JSON.parse(JSON.stringify(obj))
}


//objects dragging hack
var dragObj;
function incredibleHack(){
	if (this.children)
		for (var i in this.children)
			incredibleHack.call(this.children[i]);
	if (this.dragging && this!=dragObj)
		this.dragging=false;
}

function startDragging(data) {
	var f=false;
	getEngine().beforeClickGlobal();
	//hack for dragging objects with dragging parents
	if (!dragObj || dragObj==this.parent){
		dragObj=this;
		f=true;
	}
	if (this.beforePressActions)
		for (var i in this.beforePressActions)
			this.beforePressActions[i].call(this,data);
	if (this.actions.indexOf("drag")>-1 ){
		if (!this.mousePressPoint)
			this.mousePressPoint={};
		this.mousePressPoint.x = data.getLocalPosition(this.parent).x -
				this.position.x;
		this.mousePressPoint.y = data.getLocalPosition(this.parent).y -
				this.position.y;
		//start dragging
		if (dragObj==this)
			this.dragging = true;
	}
	//set point for click check
	if (!this.screenPressPoint)
		this.screenPressPoint={};
	var stage=this.stage || getEngine().stage;
	this.screenPressPoint.x = data.getLocalPosition(stage).x;
	this.screenPressPoint.y = data.getLocalPosition(stage).y;
	if (f)
		incredibleHack.call(this.stage);
	if (this.afterPressActions)
		for (var i in this.afterPressActions)
			this.afterPressActions[i].call(this,data);
}

function stopDragging(data) {
	if (this.beforePressStopActions)
		for (var i in this.beforePressStopActions)
			this.beforePressStopActions[i].call(this,data);
	if (this.actions.indexOf("press")>-1){
		if (!this.screenPressPoint)
			this.screenPressPoint={};
		var screenPressPoint={};
		var engine=getEngine();
		var stage=this.stage || engine.stage;
		screenPressPoint.x = data.getLocalPosition(stage).x;
		screenPressPoint.y = data.getLocalPosition(stage).y;
		if (Math.abs(this.screenPressPoint.x-screenPressPoint.x)<engine.settings.clickAreaSize && 
				Math.abs(this.screenPressPoint.y-screenPressPoint.y)<engine.settings.clickAreaSize){
			if (this.pressActions && !this.disable) //may be need smth to do
				for (var i in this.pressActions)
					this.pressActions[i].call(this);
		}
	}
	this.dragging = false;
	dragObj=false;
	if (this.afterPressStopActions)
		for (var i in this.afterPressStopActions)
			this.afterPressStopActions[i].call(this,data);
}


function proceedDragging(data){
	if (this.beforeMoveActions)
		for (var i in this.beforeMoveActions)
			this.beforeMoveActions[i].call(this,data);
	if(this.dragging){
		var position = data.getLocalPosition(this.parent);
		this.position.x = position.x - this.mousePressPoint.x;
		this.position.y = position.y - this.mousePressPoint.y;
		if (this.transformCorrection)
			this.transformCorrection();
	}
	if (this.afterMoveActions)
		for (var i in this.afterMoveActions)
			this.afterMoveActions[i].call(this,data);

}

function realPosition(obj){
	if (!obj.parent || obj.parent==obj.stage){
		return {x: obj.position.x, y: obj.position.y, scale: obj.scale.x || 1};
	}else{
		var pos=realPosition(obj.parent)
		return {x: pos.x+obj.position.x, y: pos.y+obj.position.y, scale: pos.scale*obj.scale.x}
	}
}

//find object under cursor
var lastObj;
function findCurObject(obj, pos){
	if (obj.interactive && obj.visible && obj.mouseweel){
		var real=realPosition(obj);
		var area=clone(obj.hitArea || obj.innerArea) || {x:0, y:0, width:obj.width, height:obj.height};
		area.x=(area.x+real.x);
		area.y=(area.y+real.y);
		area.width*=real.scale;
		area.height*=real.scale;
		if (area.x<pos.x && area.y<pos.y && 
			area.x+area.width>pos.x && area.y+area.height>pos.y){
				lastObj=obj;
		}
	}
	if (obj.visible)//TODO: check
		for (var i in obj.children) {
			findCurObject(obj.children[i],pos);
		}
}

function weelHandler(data){
	var pos={x: data.layerX || data.clientX, y: data.layerY || data.clientY};
	getEngine().beforeClickGlobal();
	
	lastObj=false;
	findCurObject(getEngine().stage, pos);
	if (lastObj)
		lastObj.mouseweel({originalEvent: data});
}

//opt={src:"path", height: int, width: int, frames: int}
function getTextureFrames(opt){
	if (!opt.textures){
		opt.textures=[];
		if (!opt.base)
			opt.base=new PIXI.BaseTexture.fromImage(opt.src);
		var height=opt.height || opt.base.height;
		var width=opt.width || height;
		var frames=opt.frames || opt.base.width/height || 1;
		//		a[i]=[];
		for(var j=0;j<frames;j++){
			opt.textures.push(new PIXI.Texture(opt.base, new PIXI.Rectangle(width*j, 0, width, height)));
		}
	}
	return opt.textures;
}

/*
	obj - object that contains width, and height
	opt:{
*		width: int
*		height: int
	} - will be procced only first argument
*/
function getProportionalSize(obj, opt){
	if (!opt.width && !opt.height)
		return;
	var texture = obj;//TODO: add sprite, asprite, button
	var matching = {width: 'height',height: 'width'};
	for (var i in opt)
		if (matching[opt[i]])
			return texture[matching[opt[i]]];
}

//from:int, to:int, p:float(0,1)
function getGradientColor(from, to, p){
	function R(argb){return ((argb>>16)&0xFF);}
	function G(argb){return ((argb>>8)&0xFF);}
	function B(argb){return ((argb)&0xFF);}
	var a={
		red: parseInt(R(from)-(R(from)-R(to))*p),
		green: parseInt(G(from)-(G(from)-G(to))*p),
		blue: parseInt(B(from)-(B(from)-B(to))*p)
	}
	for (var i in a)
		if((a[i]=a[i].toString(16)).length<2){
			a[i]='0'+a[i];
		}
	return parseInt(a.red+a.green+a.blue,16);
}

function healthColor(p){
	return getGradientColor(0xff0000, 0x00ff00, p);
}

function fitDimensions(from, to){ //from -screen to - wallpaper
	var height=from.width/to.width*to.height
	var width=from.height/to.height*to.width
	if (width>=from.width){
		return {width:width,height:from.height};
	}
	if (height>=from.height){
		return {width:from.width,height:height};
	}
	return from;
	
}
//when image loading for a long time
function afterBaseTextureLoad(baseTexture, func){
	function atEnd(){
		baseTexture.removeAllListeners();
		func();
	}
	if (baseTexture.hasLoaded)
		func();
	else{
		baseTexture.on("loaded", atEnd);
		baseTexture.on("error", function(){
			var e=getEngine().textures.error;
			if (e)
				baseTexture.updateSourceImage(e.src);
			atEnd();
		});
	}
}

function afterTextureLoad(texture, func){
	afterBaseTextureLoad(texture.baseTexture,func);
}

function afterSpriteLoad(sprite, func){
	afterTextureLoad(sprite.texture,func);
}

function afterASpriteLoad(sprite, func){
	afterTextureLoad(sprite.frames[sprite.current_frame].texture,func);
}


Object.defineProperty(String.prototype, 'translate', {
    get: function() {
	return  locales[this] || this;
    }
});

/*
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(callback, element){
			return window.setTimeout(callback, 1000 / 60);
		};
})();
*/
