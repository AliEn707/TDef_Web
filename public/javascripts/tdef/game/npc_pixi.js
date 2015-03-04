//for create eval("new "+obj.objtype+"(obj)")

var Npc_callbacks={
	walkleft:{
	},
	deathleft:{
		endAnimation:"remove",
	},
	deathleft:{
		endAnimation:"remove",
	}
}

function Npc(opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.map=getEngine().map;
	//static
	this.id=opt.id || 0
	this.type=opt.type || 1;
	var textures=npc_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*(opt.scale || 1);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:1},callbacks:{obj:this,actions:Npc_callbacks[i]||{}},loop:textures[i].loop,width:s,height:s});
	}
	//changeble
	this.sprite=this.sprites["idle"];
	this.grid=opt.grid || {x: 0,y: 0};
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.destination= opt.grid || {x: 0,y: 0};
	this.direction={x:0,y:0};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=opt.time || 0;
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
	this.addChild(this.sprite);
	
}
Npc.prototype= new PIXI.SpriteBatch()//DisplayObjectContainer();
Npc.prototype.constructor= Npc;


Npc.prototype.update= function (obj){
	var time=this.time;
	var dirx=(obj.grid.x-this.grid.x);
	var diry=(obj.grid.y-this.grid.y);
	//var l=Math.sqrt(dirx*dirx+diry*diry);
	this.time=obj.time;
	var timestep=latency;
	if (time!=0)
		timestep+=((this.time-time)*4/100);
	//add time correction
	this.direction.x=dirx/timestep;
	this.direction.y=diry/timestep;
		
	this.health=obj.health || this.health;
	this.shield=obj.shield || this.shield;
	this.level=obj.level || this.level;
	this.destination=obj.grid;
}

Npc.prototype.proceed= function (){
	this.grid.x+=this.direction.x;
	this.grid.y+=this.direction.y;
	
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
	//proseed sprite
	this.sprite.upFrame();
	this.scale.x=this.map.scale.x;
	this.scale.y=this.map.scale.x;
}

Npc.prototype.setSprite= function (name){
	this.removeChild(this.sprite);
	this.sprite=this.sprites[name];
	this.addChild(this.sprite);
}

Npc.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.mapObjects[this.id];
}

