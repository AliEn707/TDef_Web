var maps={};

var offset=22;
	
function TDefEngine(place, opt, callback){
	opt = opt || {};
	opt.defines=opt.defines || {};
	
	place=place || document.body;
	this.webgl=opt.webgl || true;
	this.frameTime=opt.frameTime || 1000/30;
	var width=place.offsetWidth || window.innerWidth;
	var height=window.innerHeight - offset - (place.offsetTop || 0);
	this.stage = new PIXI.Stage(0x000000);
	// create a renderer instance
	this.renderer = opt.webgl ? new PIXI.autoDetectRenderer(width, height)  : new PIXI.CanvasRenderer(width, height);
	this.renderer.view.oncontextmenu=function (){return false;}
	
	this.textures=opt.textures || {};
	// add the renderer view element to the DOM
	place.appendChild(this.renderer.view);
	this.place=place;
	//requestAnimFrame( this.render );
	setEngine(this);
	window.onresize = this.resize;
	this.keys=[]
	this.settings=opt.settings || { //defaults
			moveSpeed: 4.1, 
			zoomSpeed: 0.02,
			scrollSpeed: 16,
			xInverted:1, 
			yInverted:-1, 
			weelInverted: -1,
			clickAreaSize: 5,
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
	addWeelHendler(this.renderer.view, weelHandler);
		
	//lets load textures
	var loader={all:0,loaded:0};
	for (var i in this.textures)
		loader.all++;
	for (var i in this.textures){
		this.textures[i].base=new PIXI.BaseTexture.fromImage(this.textures[i].src);
		afterBaseTextureLoad(this.textures[i].base, function (){
			loader.loaded++;
			if (loader.loaded==loader.all){
				if (callback)
					callback();
			}
		});
	}
	
	this.setWindowHandlers();

	window.setTimeout(this.render,this.frameTime);
}


TDefEngine.prototype.render= function (){
	current_time=Date.now();
	var that=getEngine();
	window.setTimeout(that.render,that.frameTime);

	if (stats)
		stats.begin();	
	//that.stage.children.sort(function(a,b){if (a.depth && b.depth) return a.depth<b.depth; return 0;})
	that.keysProcessor();
	that.objectsProcessor();
	
	that.stage.children.sort(function(a,b){return (a.depth)<(b.depth);})
	that.renderer.render(that.stage);
	//bunny.nextFrame()
	if (stats){
		statsUpdate(that);
		stats.end();
	}
	proceedMapMessages();
	proceedPublicMessages();
}

TDefEngine.prototype.resize=function (){
	var that = getEngine();
	var place=that.place;
	var width=place.offsetWidth || window.innerWidth;
	var height=window.innerHeight - offset - (place.offsetTop || 0);
	
	that.renderer.resize(width,height);
	if (that.map)
		that.map.resize(width,height);
	for (var i in that.stage.children)
		if (that.stage.children[i].resize)
			that.stage.children[i].resize(width,height);
}

TDefEngine.prototype.outerSize= function (size){
	return Math.floor((1+(size+1)%2+size)/2)*(Math.floor(size/2)+size%2);
}


TDefEngine.prototype.parseMap = function(map){
	if (!maps[map]){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', Routes.tdef_map_get_path()+'?name='+map, false);
		xhr.send();
		if (xhr.status!=200)
			console.log(xhr)
		maps[map]=JSON.parse(xhr.responseText);
//		console.log(xhr.responseText)
	}
	if (!maps[map].data){
		var mp=maps[map].mp.split("\r\n");
		var mg=maps[map].mg.split("\r\n");
		var data={preview: maps[map].preview};
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
			if (t.length==3)
				data.walls.push({pos: parseInt(t[0]), type: t[1], tex: data.textures[t[2]]});
			else 
				break;
		}
		i++;
		//TODO: add map objects
		data.objects=[]
		for (;mg[i]!="" && i<mg.length;i++){
			var t=mg[i].split(" ");
			data.objects.push({pos: {x: t[0],y: t[1]}, tex: data.textures[t[2]]})
		}
		maps[map].data=data;
	}
	return maps[map].data;
}

TDefEngine.prototype.setMap= function (m){
	this.map_name=m;
}

TDefEngine.prototype.loadMap= function (){
	var opt=this.parseMap(this.map_name)
	var map=new Grid(opt.size);
	map.engine=this;
	map.preview=opt.preview;
	if (this.map)
		this.map.clean();
	this.map=map;
	this.stage.addChild(map);
	
	var fullsize=opt.size*opt.size;
	var size=map.size;
	map.setFocus();
	var buildableTextures=getTextureFrames(this.textures.map_build_node);
	for(var i=0;i<fullsize;i++){
		map.setNode(i,opt.textures[opt.nodes[i]]);
	//	console.log(opt.buildable,opt.buildable[i])
		if (opt.buildable[i]=="1")
			map.setBuildableNode(i,buildableTextures,{tint:this.textures.map_build_node.tint});
		
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
		map.setWall(opt.walls[i],i);
//		map.setWall({tex:new PIXI.Texture.fromImage("/textures/wall/1.png"),type:"y"});
	}
	for (var i in opt.objects){
		map.setObject(opt.objects[i],i);
	}
	
	this.map.transformCorrection();
			
	//setup handlers
	window.onkeydown=this.keysHadler;
	window.onkeyup=this.keysHadler;
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
//	console.log(this.keys)
	var actions={
		mapMoveLeft: function (){this.map.translate(this.settings.moveSpeed*this.settings.xInverted,0);}, 
		mapMoveRight: function (){this.map.translate(-this.settings.moveSpeed*this.settings.xInverted,0);},
		mapMoveUp: function (){this.map.translate(0,-this.settings.moveSpeed*this.settings.yInverted);},
		mapMoveDown: function (){this.map.translate(0,+this.settings.moveSpeed*this.settings.yInverted);}, 
		mapZoomUp: function (){this.map.zoom(1+this.settings.zoomSpeed);},
		mapZoomDown: function (){this.map.zoom(1-this.settings.zoomSpeed);}
	}
	for (var i in actions)
		if (this.keys[this.settings.defines.keys[i]]){
			this.beforeClickGlobal();
			actions[i].call(this);
		}
}

// global actions like cancel tower building menu
var beforeClickGlobal=[];
TDefEngine.prototype.beforeClickGlobal=function() {
	for (var i in beforeClickGlobal)
		beforeClickGlobal[i]();
}

TDefEngine.prototype.beforeClickGlobalAdd=function(a) {
	beforeClickGlobal.push(a);
}

TDefEngine.prototype.objectsProcessor=function() {
	var objs=this.stage.children;
	for(var i in objs){
		if (objs[i].proceed)
			objs[i].proceed();
	}
}

TDefEngine.prototype.closeMap=function() {
	mapClose();
	this.map.clean;
	
}

TDefEngine.prototype.setWindowHandlers=function() {
	function onBlur() {
//		console.log("hiden")
		stats.freeze=stats.fps;
	};
	function onFocus(){
//		console.log("showen")
		var v=stats.freeze
		stats.freeze=false;
		//hack for freezing timer on hided tab
		stats.end();
		stats.begin();
		stats.fps=v;
	};

	if (/*@cc_on!@*/false) { // check for Internet Explorer
		document.onfocusin = onFocus;
		document.onfocusout = onBlur;
	} else {
		window.onfocus = onFocus;
		window.onblur = onBlur;
	}
}

