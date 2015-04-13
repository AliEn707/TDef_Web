var locales={};


function TDefEngine(place, opt){
	opt = opt || {};
	opt.defines=opt.defines || {};
		
	place=place || document.body;
	this.webgl=opt.webgl || true;
	this.frameTime=opt.frameTime || 1000/30;
	var width=place.offsetWidth || window.innerWidth;
	var height=window.innerHeight - 10 - (place.offsetTop || 0);
	this.stage = new PIXI.Stage(0x000000);
	// create a renderer instance
	this.renderer = opt.webgl ? new PIXI.autoDetectRenderer(width, height)  : new PIXI.CanvasRenderer(width, height);
	this.renderer.view.oncontextmenu=function (){return false;}
	// add the renderer view element to the DOM
	place.appendChild(this.renderer.view);
	this.place=place;
	//requestAnimFrame( this.render );
	
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
	this.drawInterval=window.setInterval(this.render,this.frameTime)
}

function getEngine(){
	return window.engine;
}

TDefEngine.prototype.render= function (){
	var that=getEngine();
//	requestAnimFrame( that.render );
	//that.stage.children.sort(function(a,b){if (a.depth && b.depth) return a.depth<b.depth; return 0;})
	that.keysProcessor();
	that.objectsProcessor();
	
	shellSort(that.stage.children, function(a,b){return a.depth<b.depth; return 0;})
	that.renderer.render(that.stage);
	//bunny.nextFrame()
}

TDefEngine.prototype.resize=function (){
	var that = getEngine();
	var place=that.place;
	var width=place.offsetWidth || window.innerWidth;
	var height=window.innerHeight - 10 - (place.offsetTop || 0);
	
	that.renderer.resize(width,height);
	that.map.resize(width,height);
}

TDefEngine.prototype.outerSize= function (size){
	return Math.floor((1+(size+1)%2+size)/2)*(Math.floor(size/2)+size%2);
}

TDefEngine.prototype.weelHandler= function (e){
	var that=getEngine();
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

TDefEngine.prototype.parseMap = function(map){
	if (!maps[map].data){
		var mp=maps[map].mp.split("\n");
		var mg=maps[map].mg.split("\n");
		var data={};
		//mp
		data.size=parseInt(mp[0]);
		data.walkable=mp[1];
		data.buildable=mp[2];
		//TODO: full parse
		//mg
		data.textures={};
		//load textures
		walls=0;
		var i;
		for(i=0;mg[i]!='-';i++){
			var t=mg[i].split(" ");
			//TODO add atlas
			data.textures[t[0]]=new PIXI.Texture.fromImage(t[1]);
		}
		i++;
		data.nodes=mg[i].split(" ");
		i++;
		data.outerNodes=[];
		for(var j=0;j<4;j++,i++)
			data.outerNodes[3-j]=mg[i].split(" ");
		if (mg[i].split(" ")[0]=="minimap"){
			data.minimap=true;
			i++;
		}
		i++;
		//TODO add walls
		data.walls=[];
		for (;mg[i]!="" && i<mg.length;i++){
			var t=mg[i].split(" ");
			
			data.walls.push({pos: parseInt(t[0]), type: t[1], tex: data.textures[t[2]]});
		}
		maps[map].data=data;
	}
	return maps[map].data;
}

TDefEngine.prototype.setMap= function (m){
	var opt=this.parseMap(m)
	var map=new Grid(opt.size);
	map.engine=this;
	this.map=map;
	this.stage.addChild(map);
	
	var fullsize=opt.size*opt.size;
	var size=map.size;
	map.setFocus(map.getFocusTexture(focusTexturePath));
	var buildableTexture=map.getBuildableTexture(buildableTexturePath);
	for(var i=0;i<fullsize;i++){
		map.setNode(i,opt.textures[opt.nodes[i]]);
	//	console.log(opt.buildable,opt.buildable[i])
		if (opt.buildable[i]=="1")
			map.setBuildableNode(i,buildableTexture);
		
	}
	var k = 0, i, j;
	for(i=-1;i>-(size/2+size%2+1);i--)
		for(j=-i-1;j<size-(-i-1);j++) {
			map.setOuterNode(0, k, opt.textures[opt.outerNodes[0][k]], i, j);
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
			map.setOuterNode(3, k, opt.textures[opt.outerNodes[3][k]], i, j);
			k++;
		}
	for (var i=0;i<opt.walls.length;i++){
		map.setWall(opt.walls[i]);
//		map.setWall({tex:new PIXI.Texture.fromImage("/textures/wall/1.png"),type:"y"});
	}
	
	
	
	this.map.transformCorrection();
			
	//setup handlers
	addWeelHendler(this.renderer.view,this.weelHandler);
	window.onkeydown=this.keysHadler
	window.onkeyup=this.keysHadler
	
}

TDefEngine.prototype.keysHadler=function(e) {
	var that = getEngine() 
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

TDefEngine.prototype.objectsProcessor=function() {
	var objs=this.map.objects;
	
	for(var i in objs){
		if (objs[i].proceed)
			objs[i].proceed();
	}
}