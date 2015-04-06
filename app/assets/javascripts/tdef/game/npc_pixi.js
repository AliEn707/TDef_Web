//for create eval("new "+obj.objtype+"(obj)")

var Npc_callbacks={
	walk_left:{
	},
	death_left:{
		endAnimation:"remove",
	},
	death_left:{
		endAnimation:"remove",
	}
}

function Npc(opt){
	opt=opt || {};
	PIXI.DisplayObjectContainer.call(this);
	this.map=getEngine().map;
	//static
	this.id=opt.id || 0
	this.type=opt.type || 1;
	this.owner=opt.owner || 0;
	var textures=npc_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*(opt.scale || 1);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:1},callbacks:{obj:this,actions:Npc_callbacks[i]||{}},loop:textures[i].loop,delays:textures[i].delays,width:s,height:s});
	}
	//changeble
	this.sprite="idle";
	this.grid={x: opt.grid.x || 0,y: opt.grid.y || 0};
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.destination= this.grid || {x: 0,y: 0};
	this.direction={x: 0,y: 0};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=opt.time || 0;
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
	this.addChild(this.sprites[this.sprite]);

}
Npc.prototype= new PIXI.DisplayObjectContainer();
Npc.prototype.constructor= Npc;


Npc.prototype.update= function (obj){
//	var time=this.time;
	var dirx=(obj.grid.x-this.grid.x);//(obj.grid.x-this.grid.x);
	var diry=(obj.grid.y-this.grid.y);//(obj.grid.y-this.grid.y);
	var l=Math.sqrt(dirx*dirx+diry*diry);
	var timestep=1//latency;
	if (this.time!=0){
		timestep+=((obj.time-this.time)*3/100);
	
		if (!this.average_time)
			this.average_time=timestep;
		this.average_time+=timestep;
		this.average_time/=2;
	}
	//add time correction
	this.direction.x=dirx/this.average_time//timestep;
	this.direction.y=diry/this.average_time//timestep;
		
	this.health=obj.health || this.health;
	this.shield=obj.shield || this.shield;
	this.level=obj.level || this.level;
	//set new step
//	this.destination=obj.grid;
	this.time=obj.time;

//	this.grid=obj.grid;

//TODO change to set death	
	if (this.health<=0){
//		console.log("deleted npc");
		this.remove();
	}
}

Npc.prototype.proceed= function (){
	//TODO: add interpolation
	this.grid.x+=this.direction.x//*npc_types[this.type].move_speed*6/100;
	this.grid.y+=this.direction.y//*npc_types[this.type].move_speed*6/100;
	
	//proseed sprite
	this.sprites[this.sprite].upFrame();
	this.scale.x=this.map.scale.x;
	this.scale.y=this.map.scale.x;
	
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
}

Npc.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	this.sprites[this.sprite].counter=0;
	this.addChild(this.sprites[this.sprite]);
}

Npc.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.mapObjects[this.id];
}

