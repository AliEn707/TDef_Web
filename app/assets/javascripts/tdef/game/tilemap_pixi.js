

Grid.prototype = new PIXI.DisplayObjectContainer();
Grid.prototype.constructor = Grid;

function Grid(size,opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.interactive = true;
	this.actions=["drag","press"];
	this.engine=getEngine();
	
	this.border=opt.border || {top: 40, bottom: 90, left: 90, right: 0};	
	
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
	
	actions=['pressActions', 'beforePressActions', 'afterPressActions',	'beforePressStopActions',	'afterPressStopActions',	'beforeMoveActions',	'afterMoveActions',	'beforeMouseOverActions',	'afterMouseOverActions',	'beforeMouseOutActions',	'afterMouseOutActions'];
	for (var i in actions)
		this[actions[i]]=opt[actions[i]] || [];
	
	this.beforeMoveActions.push(this.beforeMoveAction);
	this.pressActions.push(this.pressAction);
	
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
	
	this.setBorders();
	this.setSets(this.engine.renderer.view.width, this.engine.renderer.view.height);
}

Grid.prototype.resize = function(width, height){
	this.transformCorrection();
	this.bordersCorrection(width, height);
	for (var i in this.children)
		if (this.children[i].resize)
			this.children[i].resize(width,height)
}

Grid.prototype.setBorders= function (){
	this.borders=new ButtonContainer({position:{x:0,y:0}});
	this.borders.left=this.borders.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.border.left+0.01,
				height: this.engine.renderer.view.height-this.border.bottom
			}
		}
	});//left
	this.borders.top=this.borders.addButton({
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
		}
	});//top
	this.borders.bottom=this.borders.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.engine.renderer.view.width,
				height: this.border.bottom+0.01
			}
		},
		position: {
			x: 0,
			y: this.engine.renderer.view.height-this.border.bottom
		}
	});//bottom
	this.borders.right=this.borders.addButton({
		sprite:{
			textures: getTextureFrames(this.engine.textures.black),
			opt:{
				width: this.border.right+0.01,
				height: this.engine.renderer.view.height-this.border.bottom-this.border.top
			}
		},
		position: {
			x: this.engine.renderer.view.width-this.border.right,
			y: this.border.top
		}
	});//right
	this.borders.depth=-0.1; //allways on screen
	this.engine.stage.addChild(this.borders);
}

Grid.prototype.bordersCorrection= function (w,h){
	this.setsCorrection(w, h);
	//set sizes
	this.borders.bottom.height=this.border.bottom;
	
	this.borders.left.height=h-this.borders.bottom.height;
	this.borders.bottom.width=w;
	this.borders.right.height=h-this.borders.bottom.height-this.borders.top.height;
	this.borders.top.width=w-this.borders.right.width;
	//set positions
	this.borders.bottom.position.y=this.borders.left.height;
	this.borders.right.position.y=this.borders.top.height;
	this.borders.right.position.x=w-this.borders.right.width;
	this.borders.top.position.x=this.borders.left.width;
}

Grid.prototype.setSets= function (width, height){
	var engine=this.engine;
	this.set={};
	//TODO:remove	
	var t=[new PIXI.Texture.fromImage("/imgtest/red.jpeg")]
	var tw=[new PIXI.Texture.fromImage("/imgtest/green.jpg")]
	
	var offset=5; //need to be calculated
	var prog=0.2; //size of progress bars 
	
	var c=1+prog;//
	var h=(width+(36*c-20)*offset)/(18*c+1);
	this.border.bottom=h;
	var size=h-offset*2;
	var psize=size*prog;
	var cont=getTextureFrames(this.engine.textures.npc_set_background);
//	var size={width:(size+psize)*9+10*offset, height:(size)+2*offset}
		
	var buttons=new ButtonContainer({
		sprite:{
			textures: cont,
			opt: {width:(width-h)/2, height:h}
		},
		position:{
			x: 0,
			y: 0,
		}
	});
	function func(){
		if (!this.disabled) 
			mapSpawnNpc(this.args.button);
	}
	
	for(var i=0;i<9;i++){
		var b=buttons.addButton({sprite:{textures: t,opt:{width: size, height: size}}, position:{x: offset+i*(size+psize+offset),y: offset}, actions:["press"], args: {button: i}, pressActions: [func]});
		b.progress=b.addButton({sprite:{textures: getTextureFrames(this.engine.textures.progress_vertical),opt:{width: psize, height: size}}, position:{x: size,y: 0}});
		b.blur=b.addButton({sprite:{textures: getTextureFrames(this.engine.textures.black),opt:{width: size, height: size}}, position:{x: 0,y: 0}});
		b.blur.alpha=0.8;
		b.disabled=true;
	}
	this.set.npc=buttons;
//	this.objects["npc_set"]=buttons;
	this.borders.bottom.addChild(buttons);
	
	cont=getTextureFrames(this.engine.textures.tower_set_background);
	var buttonSize={x:45,y:45}//TODO: add dependense of screen size
	buttons=new ButtonContainer({
		sprite:{
			textures: cont,
			opt: {width:(width-h)/2, height:h}
		},
		position:{
			x: (width-h)/2+h,
			y: 0
		}
	});
	var menu=new ButtonContainer({position:{x:100,y:100}}); //menu on press buildable node
	menu.keyPadInit({columns: 10, buttonSize: buttonSize, buttonDist:{x:buttonSize.x*1.55}, circle:{centered: false}});
	function func(){
		if (!this.disabled) 
			mapSpawnTower(this.args,menu.id); 
	}
	
	for(var i=0;i<9;i++){
		var b=buttons.addButton({sprite: {textures: tw, opt: {width: size, height: size}}, position:{x: offset+i*(size+psize+offset),y: offset}});//TODO: try to remove
		b.progress=b.addButton({sprite:{textures: getTextureFrames(this.engine.textures.progress_vertical),opt:{width: psize, height: size}}, position:{x: size,y: 0}});
		b.blur=b.addButton({sprite:{textures: getTextureFrames(this.engine.textures.black),opt:{width: size, height: size}}, position:{x: 0,y: 0}});
		b.blur.alpha=0.8;
		var m=menu.keyPadAddButton({sprite: {textures: tw, opt: {}}, actions:["press"], args: parseInt(i), pressActions: [func]});
		m.blur=m.addButton({sprite:{textures: getTextureFrames(this.engine.textures.black),opt: {width: buttonSize.x, height: buttonSize.y}}, position:{x: 0,y: 0}});
		m.blur.alpha=0.8;
		m.disabled=true;
	}
	
	this.engine.beforeClickGlobalAdd(function(){engine.map.outBuildable(engine.map);});
	menu.visible=false;
	this.set.tower=buttons;
  this.borders.bottom.addChild(buttons);
	this.objects["tower_building_menu"]=menu;
	this.engine.stage.addChild(menu);
	//set targeting
	buttons=new ButtonContainer({
		sprite:{
			textures: cont,
			opt: {width:h, height:h}
		},
		position:{
			x: (width-h)/2,
			y: 0
		},
		actions:["press"],
		pressActions: [function(){console.log("Pressed")}]//TODO: add normal action
	});
	this.set.targeting=buttons;
	this.borders.bottom.addChild(buttons);
	
	this.bordersCorrection(width, height);
}

Grid.prototype.setsCorrection= function (width, height){
	var offset=5; //need to be calculated
	var prog=0.2; //size of progress bars 
	
	var c=1+prog;//
	var h=(width+(36*c-20)*offset)/(18*c+1);
	this.border.bottom=h;
	var size=h-offset*2;
	var psize=size*prog;
	
	this.set.npc.width=(width-h)/2;
	this.set.npc.height=h;
	for (var i in this.set.npc.buttons){
		var button=this.set.npc.buttons[i];
		button.position.x=offset+parseInt(i)*(size+psize+offset);
		button.blur.width=size;
		button.blur.height=size*button.blur.height/button.width;
		button.width=size;
		button.height=size;
		button.progress.width=psize;
		button.progress.height=size;
		button.progress.position.x=size;
		//add progress status size
	}
	this.set.tower.width=(width-h)/2;
	this.set.tower.height=h;
	this.set.tower.position.x=(width-h)/2+h;
	for (var i in this.set.tower.buttons){
		var button=this.set.tower.buttons[i];
		button.position.x=offset+parseInt(i)*(size+psize+offset);
		button.blur.width=size;
		button.blur.height=size*button.blur.height/button.width;
		button.width=size;
		button.height=size;
		button.progress.width=psize;
		button.progress.height=size;
		button.progress.position.x=size;
		//add progress status size
	}
	this.set.targeting.position.x=(width-h)/2;
	this.set.targeting.width=h;
	this.set.targeting.height=h;
}

Grid.prototype.weelHandler= function (m){
	var e=m.originalEvent;
	var that=this.engine;
	e = e || window.event;
	var x=e.clientX || e.layerX;
	var y= e.clientY || e.layerY;
	if (e.type=="wheel" || e.type=="mousewheel"){
		// wheelDelta 
		var delta = e.deltaY || e.detail || e.wheelDelta;
		//change zoom
		this.zoom(1+that.settings.zoomSpeed*(delta<0 ? -1 : 1)*that.settings.weelInverted, x, y)
		//add another hendlers
	}
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


Grid.prototype.setFocus = function(){
	this.focusedNodeContainer=new PIXI.DisplayObjectContainer();
	this.focusedNodeContainer.rotation=-Math.PI/4;
	this.focusedNode=new ASprite(
		getTextureFrames(this.engine.textures.map_focused_node),
		{width: this.nodesize, height: this.nodesize, tint:this.engine.textures.map_focused_node.tint}
	);
	this.focusedNodeContainer.addChild(this.focusedNode);
	this.addChild(this.focusedNodeContainer);
}


Grid.prototype.overBuildable = function(){
	var menu=this.map.objects["tower_building_menu"];
	if (!menu)
		return;
	menu.id=this.id;
	menu.position=this.map.gridToScreen(this.position.x/this.map.nodesize+0.5, this.position.y/this.map.nodesize+0.5);
	menu.visible=true;
}

Grid.prototype.outBuildable = function(map){
	map= map || getEngine().map;
	var menu=map.objects["tower_building_menu"];
	if (!menu)
		return;
	menu.visible=false;
}

Grid.prototype.setBuildableNode = function(id, textures, opt){
	opt=opt || {};
	opt.height= this.nodesize;
	opt.width= this.nodesize;
	opt.anchor={x:0, y:1};
	var node=new ButtonContainer({sprite: new ASprite(textures, opt), actions: ['press'], pressActions: [this.overBuildable]});
	node.map=this;
	var pos=this.getPosition(id);
	
	node.position.x=pos.x;
	node.position.y=pos.y;
	node.rotation=Math.PI/2;
	node.id=id;
	
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
	node.id=id;
	
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
		i=0;
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
	this.engine.stage.removeChild(this.borders);
	this.engine.stage.removeChild(this);
	//TODO: add switch to public
}




