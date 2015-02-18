function addWeelHendler(elem,onWheel){
	if (elem.addEventListener) {
		if ('onwheel' in document) {
			// IE9+, FF17+
			elem.addEventListener ("wheel", onWheel, false);
		} else 
			if ('onmousewheel' in document) {
				// устаревший вариант события
				elem.addEventListener ("mousewheel", onWheel, false);
			} else {
				// 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
				elem.addEventListener ("MozMousePixelScroll", onWheel, false);
			}
	}else { // IE<9
		elem.attachEvent ("onmousewheel", onWheel);
	}
}

function fixWhich(e) {
  if (!e.which && e.button) { // если which нет, но есть button...
    if (e.button & 1) e.which = 1;      // левая кнопка
    else if (e.button & 4) e.which = 2; // средняя кнопка
    else if (e.button & 2) e.which = 3; // правая кнопка
  }
}


function TDefEngine(){
	this.canavas = document.getElementById('mainGameCanvas')
	this.canvasParent = this.canavas.parentNode

	this.canavas.width = this.canvasParent.offsetWidth - 1
	this.canavas.height = window.innerHeight - this.canvasParent.offsetTop - 5
	this.ctx = this.canavas.getContext('2d')
	//this.ctx.fillRect(0,0,this.canavas.width,this.canavas.height)
	this.keys=[]
	this.mouse={buttons: [], counter:0, pos: {}}
	this.settings={
			moveSpeed: 4.1, 
			zoomSpeed: 0.1,
			xInverted:1, 
			yInverted:-1, 
			weelInverted: -1,
			mouseMove: true,
			defines:{
				keys:{
					mapMoveLeft:65, /*a*/
					mapMoveRight:68,/*d*/
					mapMoveUp:87,/*w*/
					mapMoveDown:83,/*s*/
					mapZoomUp:90,/*z*/
					mapZoomDown:88/*x*/
				}
			}
		}
}

TDefEngine.prototype.update=function() {
		var that = window.engine 
		canvasParent = that.canvasParent
		var canavas = that.canavas
		canavas.width = canvasParent.offsetWidth - 1
		canavas.height = window.innerHeight - canvasParent.offsetTop - 5
		ctx.fillRect(0,0,canavas.width,canavas.height)
//		console.log(that.map)
		if (that.map){
			that.map.setCanvasParameters({width:canavas.width, height: canavas.height})
		}
	}

TDefEngine.prototype.proseed=function() {
	var that=window.engine
	that.map.draw(that.ctx)
	that.map.textures[0].update();
	that.map.textures[0].draw(that.ctx,0,0)
	that.keysProcessor()
}

TDefEngine.prototype.keysHadler=function(e) {
	var that = window.engine 
	//set continued actions
	if (e.type=="keydown"){	
//		console.log("key "+e.keyCode+"pushed")
		that.keys[e.keyCode]=true
	}else{
//		console.log("key "+e.keyCode+"realized")
		that.keys[e.keyCode]=false
	}
	//set single actions
	
}

TDefEngine.prototype.keysProcessor=function() {
	var 	mapUpdated=false
//	console.log(this.keys)
	if (this.keys[this.settings.defines.keys.mapMoveUp]){
		this.map.translate(0,-this.settings.moveSpeed*this.settings.yInverted)
		mapUpdated=true
	}
	if (this.keys[this.settings.defines.keys.mapMoveDown]){
		this.map.translate(0,+this.settings.moveSpeed*this.settings.yInverted)
		mapUpdated=true
	}
	if (this.keys[this.settings.defines.keys.mapMoveLeft]){ 
		this.map.translate(this.settings.moveSpeed*this.settings.xInverted,0)
		mapUpdated=true
	}
	if (this.keys[this.settings.defines.keys.mapMoveRight]){ 
		this.map.translate(-this.settings.moveSpeed*this.settings.xInverted,0)
		mapUpdated=true
	}	
	if (this.keys[this.settings.defines.keys.mapZoomUp]){ 
		this.map.scale(1+this.settings.zoomSpeed)
		mapUpdated=true
	}	
	if (this.keys[this.settings.defines.keys.mapZoomDown]){ 
		this.map.scale(1-this.settings.zoomSpeed)
		mapUpdated=true
	}	
		
	if (mapUpdated)
		this.map.update()
}

TDefEngine.prototype.mouseHandler=function(e) {
	var that=window.engine
	e = e || window.event;
	var x=e.clientX || e.layerX
	var y= e.clientY || e.layerY
//	console.log(e.type)
	if (e.type=="wheel" || e.type=="mousewheel"){
		// wheelDelta не дает возможность узнать количество пикселей
		var delta = e.deltaY || e.detail || e.wheelDelta;
		//change zoom
		that.map.scale(1+that.settings.zoomSpeed*(delta<0 ? -1 : 1)*that.settings.weelInverted, x, y)
		//add another hendlers
		that.map.update()
	}else if (e.type=="mousedown"){
		fixWhich(e)
		that.mouse.buttons[e.which]=true
		
	}else if (e.type=="mouseup"){
		fixWhich(e)
		that.mouse.buttons[e.which]=false
	}else if (e.type=="mousemove"){
		if (that.mouse.buttons[3] && that.settings.mouseMove){//move by right button
			that.map.translate(x-that.mouse.pos.x,y-that.mouse.pos.y)
			that.mouse.counter++
			if (that.mouse.counter==6){//some performance hint
				that.map.update()
				that.mouse.counter=0
			}
		}
		that.mouse.pos.x= x
		that.mouse.pos.y= y
	}
	
}

/*
TDefEngine.prototype.keysHadlerDown=function(e) {
	console.log(e)
}

TDefEngine.prototype.keysHadlerUp=function(e) {
	console.log(e)
}
*/

TDefEngine.prototype.init=function(){
	window.engine = this
	window.onresize = this.update
//	window.onkeypress=this.keysHadler
	window.onkeydown=this.keysHadler
	window.onkeyup=this.keysHadler
	addWeelHendler(this.canavas,this.mouseHandler)
	this.canavas.onmousedown=this.mouseHandler
	this.canavas.onmouseup=this.mouseHandler
	this.canavas.onmousemove=this.mouseHandler
	this.canavas.oncontextmenu=function (){return false;}
	
	this.drawInterval=window.setInterval(this.proseed,1000/60)
}