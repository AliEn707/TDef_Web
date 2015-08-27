//for create eval("new "+obj.objtype+"(obj)")

var Npc_callbacks={
	walk_left:{
	},
	walk:{ //may be used for walk_left, and _right, if there no them
	},
	attack:{ //may be used for walk_left, and _right, if there no them
//		endAnimation:"setWalk",
	},
	death_left:{
		endAnimation:"remove",
	},
	death_right:{
		endAnimation:"remove",
	}
}

function Npc(opt){
	opt=opt || {};
	PIXI.DisplayObjectContainer.call(this);
	this.engine=getEngine();
	this.map=this.engine.map;
	//static
	this.id=opt.id || 0
	this.type=opt.type != undefined ? opt.type : 1;
	this.owner=opt.owner || 0;
	var textures=npc_types[this.type].textures;
	this.sprites={};
	var s=this.map.nodesize*0.79*(opt.scale || 1);
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:1},callbacks:{obj:this,actions:Npc_callbacks[i] || Npc_callbacks[i.split("_")[0]] || {}},loop:textures[i].loop,delays:textures[i].delays,width:s,height:s});
	}
	this.setHealthSprite(s);
	
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
	
	this.addChildAt(this.sprites[this.sprite],0);

}
Npc.prototype= new PIXI.DisplayObjectContainer();
Npc.prototype.constructor= Npc;

Npc.prototype.setHealth= function (health){
	this.health=health;
	var type_health=this.type>0 ? npc_types[this.type].health : this.engine.map.players[this.owner].type.hero.health;
	var obj=this.health/type_health;
	if (obj>1)
		obj=1;
	this.health_sprite.texture.setFrame({x:0,y:0,width:this.engine.textures.health.texture.width*obj,height:this.engine.textures.health.texture.height});
	this.health_sprite.tint=healthColor(obj);
}

Npc.prototype.getAngle= function (v){
	var length=Math.sqrt(v.x*v.x+v.y*v.y);
	var angle=length!=0 ? Math.acos((v.y)/(length)) : 0;
	return angle*( v.x<0 ? -1 : 1);//cos is on half of circle
}

Npc.prototype.setSpriteByVector= function (v){
	var ang=this.getAngle(v);
	var p8=Math.PI/8;
	//need to correct
	if (ang>7*p8 || ang<=-7*p8){
		this.setSpriteAdd("leftdown");
		return;
	}
	if (ang>-7*p8 && ang<=-5*p8){
		this.setSpriteAdd("left");
		return;
	}
	if (ang>-5*p8 && ang<=-3*p8){
		this.setSpriteAdd("leftup");
		return;
	}
	if (ang>-3*p8 && ang<=-p8){
		this.setSpriteAdd("up");
		return;
	}
	if (ang>-p8 && ang<=p8){
		this.setSpriteAdd("rightup");
		return;
	}
	if (ang>p8 && ang<=3*p8){
		this.setSpriteAdd("right");
		return;
	}
	if (ang>3*p8 && ang<=5*p8){
		this.setSpriteAdd("rightdown");
		return;
	}
	if (ang>5*p8 && ang<=7*p8){
		this.setSpriteAdd("down");
		return;
	}
}

Npc.prototype.proceedStatus= function (s){
	var statuses={
		0: "idle",
		1: "attack",
		2: "walk",
	}
	if (statuses[s]!=undefined){
		this.setSprite(statuses[s]);
	}
}

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
	
	
	if (obj.health!=undefined){
		this.setHealth(obj.health);
	}
	this.proceedStatus(obj.status)
	this.setSpriteByVector(this.direction);
	
	if (obj.shield!=undefined)
		this.shield=obj.shield;
	if (obj.level!=undefined)
		this.level=obj.level;
	//set new step
//	this.destination=obj.grid;
	this.time=obj.time;

//	this.grid=obj.grid;

//TODO change to set death	
	if (this.health<=0 || obj.health<=0){
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

Npc.prototype.setHealthSprite= function (s){
	this.health_sprite=new PIXI.Sprite(new PIXI.Texture(this.engine.textures.health.base));
	//this needs for correct loading 
	var that=this;
	afterSpriteLoad(this.health_sprite,function (){
		that.health_sprite.height=that.health_sprite.height/that.health_sprite.width*that.map.nodesize;
		that.health_sprite.width=that.map.nodesize;
		that.health_sprite.position.y=-s*0.8;
		that.health_sprite.position.x=-that.health_sprite.width*0.5;
	});
	this.health_sprite.anchor={x:0,y:1};
	this.health_sprite.tint=healthColor(1);
	this.addChild(this.health_sprite);
}

Npc.prototype.setSpriteAdd= function (name){
	var sprite=this.sprite.split("_");
	if (sprite[1]!=name)
		if (this.sprites[sprite[0]+"_"+name])
			this.setSprite(sprite[0]+"_"+name);
}

Npc.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	//TODO: check, maybe not need
	if (!this.sprites[this.sprite].loop)
		this.sprites[this.sprite].chooseFrame(0);
	this.sprites[this.sprite].counter=0;
	this.addChildAt(this.sprites[this.sprite],0);
}

Npc.prototype.setWalk= function (){
	this.setSprite("walk");
	this.setSpriteByVector(this.direction);
}

Npc.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.map.objects[this.id];
}

