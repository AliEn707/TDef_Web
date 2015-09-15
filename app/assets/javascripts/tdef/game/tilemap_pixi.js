

Grid.prototype = new PIXI.DisplayObjectContainer();
Grid.prototype.constructor = Grid;

function Grid(size,opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.interactive = true;
	this.actions=["drag","press"];
	this.engine=getEngine();
	
	this.border=opt.border || {top: 0, bottom: 90, left: 90, right: 0};	
	
	this.width=this.engine.renderer.view.width
	this.height=this.engine.renderer.view.height
	this.size = size;
	this.fullsize = size*size;
	this.nodesize=50;
	
	this.scale.x = 1;
	this.scale.y = 0.5;
	this.position.x=0;
	this.position.y=0;
	this.dragging = false;
	this.hitArea= new PIXI.Rectangle(0,-this.size*this.nodesize*1.41*2,this.size*this.nodesize*1.41,this.size*this.nodesize*1.41*4)//TODO: check maybe too big
	
	this.mousedown = this.touchstart = startDragging;
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = stopDragging;
	
	this.mousemove = this.touchmove = proceedDragging;
	this.mouseweel=this.weelHandler;
	
	this.nodes= new PIXI.DisplayObjectContainer();//PIXI.SpriteBatch()
	this.nodes.rotation=-Math.PI/4;
	this.addChild(this.nodes);
	this.nodesOut=new Array(4);
	for (var i =0;i<4;i++){
		this.nodesOut[i]= new PIXI.DisplayObjectContainer()//PIXI.SpriteBatch();
		this.nodesOut[i].rotation=-Math.PI/4;
		this.addChild(this.nodesOut[i]);
	}
	
	this.buildable= new PIXI.DisplayObjectContainer();
	this.buildable.rotation=-Math.PI/4;
	this.addChild(this.buildable);
	
	this.objects={};//contains npc,towers,bullets

//	this.transformCorrection()
	this.players={};
	this.depth=200000000; //TODO: change stupid way
	//set borders
	this.window=new ButtonContainer({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.border.left+0.01,
				height: this.engine.renderer.view.height
			}
		},
		float:{y:"fixed"}
	});//left
	this.window.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.engine.renderer.view.width-this.border.left,
				height: this.border.top+0.01
			}
		},
		position: {
			x: this.border.left,
			y: 0
		},
		float:{x:"fixed"}
	});//top
	this.window.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.engine.renderer.view.width-this.border.left,
				height: this.border.bottom+0.01
			}
		},
		position: {
			x: this.border.left,
			y: this.engine.renderer.view.height-this.border.bottom,
			float:{y:"fixed"}
		},
		float:{x:"fixed"}
	});//bottom
	this.window.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.border.right+0.01,
				height: this.engine.renderer.view.height-this.border.bottom-this.border.top
			}
		},
		position: {
			x: this.engine.renderer.view.width-this.border.right,
			y: this.border.top,
			float:{x:"fixed"}
		},
		float:{y:"fixed"}
	});//right
	this.window.depth=-0.1;
	this.engine.stage.addChild(this.window);
}

focusTexturePath="/imgtest/build.png";
buildableTexturePath="/imgtest/tower_mark.png";


Grid.prototype.weelHandler= function (m){
	var e=m.originalEvent;
	var that=this.engine;
	e = e || window.event;
	var x=e.clientX || e.layerX;
	var y= e.clientY || e.layerY;
	if (e.type=="wheel" || e.type=="mousewheel"){
		// wheelDelta ?? ???? ??????????? ?????? ?????????? ????????
		var delta = e.deltaY || e.detail || e.wheelDelta;
		//change zoom
		this.zoom(1+that.settings.zoomSpeed*(delta<0 ? -1 : 1)*that.settings.weelInverted, x, y)
		//add another hendlers
	}
}

Grid.prototype.resize = function(width, height){
	this.transformCorrection();
	for (var i in this.children)
		if (this.children[i].resize)
			this.children[i].resize(width,height)
}

Grid.prototype.translate = function(x,y){
	this.position.x+=x || 0;
	this.position.y+=y || 0;
	this.transformCorrection();
}

Grid.prototype.zoom = function(s,x,y){
	s=s || 1
	var engine=getEngine();
	var w=x || engine.renderer.view.width/2;
	var h=y || engine.renderer.view.height/2;
	var grd=this.screenToGrid(w,h);
	this.scale.x*=s;
	this.scale.y*=s;
	var scr=this.gridToScreen(grd.x,grd.y);
	var shiftx=(scr.x-w);
	var shifty=(scr.y-h);
	this.translate(-shiftx,-shifty);
	this.transformCorrection();
}

Grid.prototype.inArea=function(point){
	return point.x>=0 && point.x<this.size && point.y>=0 && point.y<this.size;
}

Grid.prototype.setAction=function(a){
	this.currentAction=a;
}

Grid.prototype.pressAction=function(){
	var point=this.screenToGrid(this.screenPressPoint.x,this.screenPressPoint.y);
	if (this.inArea(point)){
		var id=this.getId(point);
		console.log(id);
		if (this.currentAction)
			this.currentAction(id);
	}else{
		this.currentAction=0;
	}
}

Grid.prototype.beforeMoveAction=function(data){
	var position=data.getLocalPosition(this.stage);
	var grid=this.screenToGrid(position.x,position.y);
	if (!this.inArea(grid))
		return;
	var id=this.getId(grid);
	//procced cursor on map
	this.focusedNode.position=this.getPosition(id);
}

Grid.prototype.transformCorrection=function(){
	var width=getEngine().renderer.view.width-this.border.left-this.border.right;
	var height=getEngine().renderer.view.height-this.border.top-this.border.bottom;
	
	var l=this.gridToScreen(0,0).x;
	var d=this.gridToScreen(this.size,0).y;
	var u=this.gridToScreen(0,this.size).y;
	var r=this.gridToScreen(this.size,this.size).x;
	var x=r-l;
	var y=u-d;
	var scale=1;
	if (x<(width) || y<(height)){
		if (x-(width)<y-(height))
			scale=(width)/x;
		else
			scale=(height)/y;
	}
	this.scale.x*=scale;
	this.scale.y*=scale;
	
	l=this.gridToScreen(0,0).x;
	d=this.gridToScreen(this.size,0).y;
	u=this.gridToScreen(0,this.size).y;
	r=this.gridToScreen(this.size,this.size).x;
	if (l>this.border.left){
		this.position.x-=l-this.border.left;
	}
	if (r<this.border.left+width){
		this.position.x-=r-(this.border.left+width);
	}
	if (u<this.border.top+height){
		this.position.y-=u-(this.border.top+height);
	}
	if (d>this.border.top){
		this.position.y-=d-this.border.top;
	}
}

Grid.prototype.objDepth=function (x, y){
	return x+this.size-y;
}

Grid.prototype.gridToScreen=function (x, y){
	x=x||0
	y=y||0
	var nodeSize=this.nodesize
	return {x: this.scale.x*nodeSize*(0.707*x + 0.707*y)+this.position.x,
			y:this.scale.x*nodeSize*0.5*(0.707*y- 0.707*x) + this.position.y}
}

Grid.prototype.screenToGrid=function (x, y){
	x=x || 0
	y=y || 0
	var sx=this.scale.x
	var sy=this.scale.x*0.5
	var tx=this.position.x
	var ty=this.position.y
	var nodeSize=this.nodesize
	return {x: (-(500*y)/(707*sy)+(500*x)/(707*sx)+(500*sx*ty-500*sy*tx)/(707*sx*sy))/nodeSize,
			y: ((500*y)/(707*sy)+(500*x)/(707*sx)-(500*sx*ty+500*sy*tx)/(707*sx*sy))/nodeSize}
}


Grid.prototype.getId = function(pos){
	return parseInt(pos.y)*this.size+parseInt(pos.x);
}

Grid.prototype.getPosition = function(id){
	return {x: parseInt(id%this.size) * this.nodesize, y: parseInt(id/this.size) * this.nodesize}
}

//used to get texture for setFocus
Grid.prototype.getFocusTexture = function(path, opt){
	return new PIXI.Texture.fromImage(path);
}

Grid.prototype.setFocus = function(texture, opt){
	this.focusedNodeContainer=new PIXI.DisplayObjectContainer();
	this.focusedNodeContainer.rotation=-Math.PI/4;
	this.focusedNode=new PIXI.Sprite(texture);
	this.focusedNode.height=this.nodesize
	this.focusedNode.width=this.nodesize
	
	this.focusedNodeContainer.addChild(this.focusedNode);
	this.addChild(this.focusedNodeContainer);
}

//uset to get texture for setBuildableNode
Grid.prototype.getBuildableTexture = function(path, opt){
	return new PIXI.Texture.fromImage(path);
}

Grid.prototype.setBuildableNode = function(id, terrain, opt){
	opt=opt || {};
	var node=new PIXI.Sprite(terrain)//TODO: change to ASptrite
	var pos=this.getPosition(id)
	
	node.height=this.nodesize
	node.width=this.nodesize
	node.position.x=pos.x
	node.position.y=pos.y
	node.rotation=Math.PI/2;
	node.anchor.y=1;
	node.id=id
	
	this.buildable.addChild(node);
}

//set texture for node in map
Grid.prototype.setNode = function(id, terrain, opt){
	opt=opt || {};
	var node=new PIXI.Sprite(terrain) //TODO: change to ASptrite
	var pos=this.getPosition(id)
	
	node.height=this.nodesize
	node.width=this.nodesize
	node.position.x=pos.x
	node.position.y=pos.y
	node.rotation=Math.PI/2;
	node.anchor.y=1;
	node.id=id
	this.nodes.addChildAt(node, id);
}

//set texture for nodes out of map
Grid.prototype.setOuterNode = function(pos, id, terrain, x, y){
	var node=new PIXI.Sprite(terrain)//TODO: change to ASptrite
	
	node.height=this.nodesize
	node.width=this.nodesize
	node.position.x=x*this.nodesize
	node.position.y=y*this.nodesize
	node.rotation=Math.PI/2;
	node.anchor.y=1;
	node.id=id
	
	this.nodesOut[pos].addChildAt(node, id);
}

Grid.prototype.getNode = function(id){
	return this.getChildAt(0).getChildAt(id);
}

Grid.prototype.setWall = function(wall,i){
	var w=new Wall(wall);
	var wc=new PIXI.DisplayObjectContainer();
	wc.position=this.position;
	wc.scale=this.scale;
	var wcc=new PIXI.DisplayObjectContainer();
	wcc.rotation=-Math.PI/4;
	wcc.addChild(w);
	
	wc.addChild(wcc);
	wc.depth=this.objDepth(w.position.x/this.nodesize+0.5,w.position.y/this.nodesize+0.5)+0.02;
	if (!i){
		i=0
		while (this.objects["wall"+i]) i++; //bad but is
	}
	this.objects["wall"+i]=wc;
	this.engine.stage.addChild(wc);
}

Grid.prototype.setObject = function(obj,i){
	var o=new PIXI.Sprite(obj.tex);//TODO: change to ASptrite
	var pos={x: parseInt(obj.pos.x)+0.5, y: parseInt(obj.pos.y)+0.5};
	o.height=this.nodesize*2*1.42;
	o.width=this.nodesize*1.42;
	o.position=this.gridToScreen(pos.y,pos.x);
	o.position.y*=2;
	o.anchor.x=0.5;
	o.anchor.y=1;
	o.id=i;
	var c=new PIXI.DisplayObjectContainer();
	c.position=this.position;
	c.scale=this.scale;
	
	c.addChild(o);
	c.depth=this.objDepth(pos.y, pos.x)+0.03;
	if (!i){
		i=0;
		while (this.objects["obj"+i]) i++; //bad but is
	}
	this.objects["obj"+i]=c;
	this.engine.stage.addChild(c);
}

//clean objects from stage
Grid.prototype.clean = function(){
	for(var i in this.objects){
		this.engine.stage.removeChild(this.objects[i]);
	}
	this.engine.stage.removeChild(this.window);
	this.engine.stage.removeChild(this);
	//TODO: add switch to public
}




