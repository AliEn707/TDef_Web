function TDefEngine(place, opt){
	opt = opt || {};
	opt.defines=opt.defines || {};
	
	place=place || document.body;
	this.webgl=opt.webgl;
	var width=place.offsetWidth || window.innerWidth;
	var height=window.innerHeight - 5 - (place.offsetTop || 0);
	this.stage = new PIXI.Stage(0x000000);
	// create a renderer instance
	this.renderer = opt.webgl ?new PIXI.autoDetectRenderer(width, height)  : new PIXI.CanvasRenderer(width, height);
	// add the renderer view element to the DOM
	place.appendChild(this.renderer.view);
	this.place=place;
	requestAnimFrame( this.render );
	
	window.engine=this;
	window.onresize = this.resize;
	this.keys=[]
	this.settings={
			moveSpeed: 4.1, 
			zoomSpeed: 0.02,
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
		};
}


TDefEngine.prototype.render= function (){
	var that=window.engine;
	requestAnimFrame( that.render );

	    // just for fun, lets rotate mr rabbit a little
//	    bunny.rotation += 0.1;
	//a.nextFrame()
	    // render the stage
	    that.renderer.render(that.stage);
	that.keysProcessor()
	//bunny.nextFrame()
}

TDefEngine.prototype.resize=function (){
	var that = window.engine ;
	var place=that.place;
	var width=window.innerWidth - (place.offsetLeft*2 || 0);
	var height=window.innerHeight - 5 - (place.offsetTop || 0);
	
	that.renderer.resize(width,height);
	that.map.resize(width,height);
}

TDefEngine.prototype.outerSize= function (size){
	return Math.floor((1+(size+1)%2+size)/2)*(Math.floor(size/2)+size%2);
}

TDefEngine.prototype.weelHandler= function (e){
	var that=window.engine;
	e = e || window.event;
	var x=e.clientX || e.layerX;
	var y= e.clientY || e.layerY;
	if (e.type=="wheel" || e.type=="mousewheel"){
		// wheelDelta не дает возможность узнать количество пикселей
		var delta = e.deltaY || e.detail || e.wheelDelta;
		//change zoom
		that.map.zoom(1+that.settings.zoomSpeed*(delta<0 ? -1 : 1)*that.settings.weelInverted, x, y)
		//add another hendlers
//		that.map.update()
	}
}

TDefEngine.prototype.setMap= function (opt){
	var map=new Grid(opt.size);
	var fullsize=opt.size*opt.size;
	var size=map.size;
	for(var i=0;i<fullsize;i++)
		map.setNode(i,opt.textures[opt.nodes[i]]);
	var k = 0, i, j;
		for(i=-1;i>-(size/2+size%2+1);i--)
			for(j=-i-1;j<size-(-i-1);j++) {
				map.setOuterNode(0, k, opt.textures[opt.outerNodes[0][k]], i-(this.webgl?0:1), j);
				k++;
			}
		k=0;
		for(j=0;j<(size/2+size%2+1);j++)
			for(i=j;i<size-j;i++) {
				map.setOuterNode(1, k, opt.textures[opt.outerNodes[1][k]], i, size + j);
				k++;
			}
		k=0;
		for(i=0;i<(size/2+size%2+1);i++)
			for(j=i;j<size-i;j++) {
				map.setOuterNode(2, k, opt.textures[opt.outerNodes[2][k]], size + i, j);
				k++;
			}
		k=0;
		for(j=-1;j>-(size/2+size%2+1);j--)
			for(i=-j-1;i<size-(-j-1);i++) {
				map.setOuterNode(3, k, opt.textures[opt.outerNodes[3][k]], i, j-(this.webgl?0:1));
				k++;
			}
	
	
	this.map=map;
	this.stage.addChild(map);
	this.map.transformCorrection();
			
	//setup handlers
	addWeelHendler(this.renderer.view,this.weelHandler);
	window.onkeydown=this.keysHadler
	window.onkeyup=this.keysHadler
	
}

TDefEngine.prototype.keysHadler=function(e) {
	var that = window.engine 
	//set continued actions
//	console.log("key "+e.keyCode)
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
	}
	if (this.keys[this.settings.defines.keys.mapMoveDown]){
		this.map.translate(0,+this.settings.moveSpeed*this.settings.yInverted)
	}
	if (this.keys[this.settings.defines.keys.mapMoveLeft]){ 
		this.map.translate(this.settings.moveSpeed*this.settings.xInverted,0)
	}
	if (this.keys[this.settings.defines.keys.mapMoveRight]){ 
		this.map.translate(-this.settings.moveSpeed*this.settings.xInverted,0)
	}	
	if (this.keys[this.settings.defines.keys.mapZoomUp]){ 
		this.map.zoom(1+this.settings.zoomSpeed)
	}	
	if (this.keys[this.settings.defines.keys.mapZoomDown]){ 
		this.map.zoom(1-this.settings.zoomSpeed)
	}	
}
