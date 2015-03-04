Grid.prototype = new PIXI.DisplayObjectContainer();
Grid.prototype.constructor = Grid;

function Grid(size,opt){
	opt=opt || {}
	PIXI.SpriteBatch.call(this);
	this.interactive = true;
	
	this.width=getEngine().renderer.view.width
	this.height=getEngine().renderer.view.height
	this.size = size;
	this.fullsize = size*size;
	this.nodesize=50
	
	this.scale.x = 1
	this.scale.y = 0.5;
	this.position.x=0
	this.position.y=0
	this.dragging = false;
	this.mousePressPoint=[0,0]
	this.hitArea= new PIXI.Rectangle(0,-this.size*this.nodesize*0.705,this.size*this.nodesize*1.41,this.size*this.nodesize*1.41)
	
	this.mousedown = this.touchstart = function(data) {
		this.mousePressPoint[0] = data.getLocalPosition(this.parent).x -
                                this.position.x;
		this.mousePressPoint[1] = data.getLocalPosition(this.parent).y -
                                this.position.y;
		this.dragging = true;
	}
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function(data) {
		this.dragging = false;
	}
	this.mousemove = this.touchmove = function(data){
		if(this.dragging){
			var position = data.getLocalPosition(this.parent);
			this.position.x = position.x - this.mousePressPoint[0];
			this.position.y = position.y - this.mousePressPoint[1];
			this.transformCorrection();
		}
	}
	
	this.nodes= new PIXI.SpriteBatch()//PIXI.DisplayObjectContainer
	this.nodes.rotation=-Math.PI/4
	this.addChild(this.nodes);
	this.nodesOut=new Array(4)
	for (var i =0;i<4;i++){
		this.nodesOut[i]= new PIXI.SpriteBatch()//PIXI.DisplayObjectContainer
		this.nodesOut[i].rotation=-Math.PI/4
		this.addChild(this.nodesOut[i]);
	}
	
	this.objs= new PIXI.SpriteBatch()//PIXI.DisplayObjectContainer
	this.addChild(this.objs);
	
//	this.transformCorrection()
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
	var w=x || engine.renderer.view.width/2
	var h=y || engine.renderer.view.height/2
	var grd=this.screenToGrid(w,h)
	this.scale.x*=s
	this.scale.y*=s
	var scr=this.gridToScreen(grd.x,grd.y)
	var shiftx=(scr.x-w)
	var shifty=(scr.y-h)
	this.translate(-shiftx,-shifty)
	this.transformCorrection()
}

Grid.prototype.transformCorrection=function(){
	var width=getEngine().renderer.view.width
	var height=getEngine().renderer.view.height
	
	var l=this.gridToScreen(0,0).x
	var d=this.gridToScreen(this.size,0).y
	var u=this.gridToScreen(0,this.size).y
	var r=this.gridToScreen(this.size,this.size).x
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
	
	l=this.gridToScreen(0,0).x
	d=this.gridToScreen(this.size,0).y
	u=this.gridToScreen(0,this.size).y
	r=this.gridToScreen(this.size,this.size).x
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


Grid.prototype.getPosition = function(id){
	return {x: parseInt(id%this.size) * this.nodesize, y: parseInt(id/this.size) * this.nodesize}
}

Grid.prototype.setOuterNode = function(pos, id, terrain,x,y){
	node=new PIXI.Sprite(terrain)
	
	node.height=this.nodesize
	node.width=this.nodesize
	node.position.x=x*this.nodesize
	node.position.y=y*this.nodesize
	node.anchor.x = 0;
	node.anchor.y = 0;
	node.id=id
	this.nodesOut[pos].addChildAt(node, id);
}

Grid.prototype.setNode = function(id, terrain){
	node=new PIXI.Sprite(terrain)
	pos=this.getPosition(id)
	
	node.height=this.nodesize
	node.width=this.nodesize
	node.position.x=pos.x
	node.position.y=pos.y
	node.id=id
	
	this.nodes.addChildAt(node, id);
}


Grid.prototype.getNode = function(id){
	return this.getChildAt(0).getChildAt(id);
}



