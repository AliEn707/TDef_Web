

Grid.prototype = new PIXI.DisplayObjectContainer();
Grid.prototype.constructor = Grid;

function Grid(size,opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.interactive = true;
	this.actions=["drag","press"];
	if (!this.engine)
		this.engine=getEngine();
		
	this.width=getEngine().renderer.view.width
	this.height=getEngine().renderer.view.height
	this.size = size;
	this.fullsize = size*size;
	this.nodesize=50;
	
	this.scale.x = 1;
	this.scale.y = 0.5;
	this.position.x=0;
	this.position.y=0;
	this.dragging = false;
	this.hitArea= new PIXI.Rectangle(0,-this.size*this.nodesize*0.705,this.size*this.nodesize*1.41,this.size*this.nodesize*1.41)
	
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
	
	this.objs= new PIXI.SpriteBatch();//PIXI.DisplayObjectContainer
	this.addChild(this.objs);
	
	this.objects={};//contains npc,towers,bullets

//	this.transformCorrection()
	this.players={};
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

Grid.prototype.resize = function(x,y){
	this.transformCorrection();
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
	var width=getEngine().renderer.view.width;
	var height=getEngine().renderer.view.height;
	
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
	if (l>0){
		this.position.x-=l;
	}
	if (r<width){
		this.position.x-=r-(width);
	}
	if (u<height){
		this.position.y-=u-(height);
	}
	if (d>0){
		this.position.y-=d;
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
	var node=new PIXI.Sprite(terrain)
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
	var node=new PIXI.Sprite(terrain)
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
	var node=new PIXI.Sprite(terrain)
	
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

Grid.prototype.setWall = function(wall){
	var w=new Wall(wall);
	var wc=new PIXI.DisplayObjectContainer();
	wc.position=this.position;
	wc.scale=this.scale;
	var wcc=new PIXI.DisplayObjectContainer();
	wcc.rotation=-Math.PI/4;
	wcc.addChild(w);
	
	wc.addChild(wcc);
	wc.depth=this.objDepth(w.position.x/this.nodesize+0.5,w.position.y/this.nodesize+0.5)+0.02;
	var i=0;
	while (this.objects["wall"+i]) i++; //bad but is
	this.objects["wall"+i]=wc;
	this.engine.stage.addChild(wc);
}

Grid.prototype.setWallComplete = function(wall){
	
}

//clean objects from stage
Grid.prototype.clean = function(){
	for(var i in this.objects){
		this.engine.stage.removeChild(this.objects[i]);
	}
	this.engine.stage.removeChild(this);
	//TODO: add switch to public
}




