//for create eval("new "+obj.objtype+"(obj)")
function Npc(opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.map=getEngine().map;
	//static
	this.type=opt.type || 1;
	var textures=npc_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*(opt.scale || 1);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:1},width:s,height:s});
	}
	//changeble
	this.sprite=this.sprites["idle"];
	this.grid={x:opt.x || 0,y:opt.y || 0};
	this.position=this.map.gridToScreen(this.grid.x,this.grid.y);
	this.destination={x:opt.x || 0,y:opt.y || 0};
	this.direction={x:0,y:0};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=0;
	this.depth=this.map.objDepth(this.grid.x,this.grid.y);
	this.addChild(this.sprite);
	
}
Npc.prototype= new PIXI.SpriteBatch()//DisplayObjectContainer();
Npc.prototype.constructor= Npc;


Npc.prototype.update= function (obj){
	var time=this.time;
	var dirx=(obj.x-this.grid.x);
	var diry=(obj.y-this.grid.y);
	var l=Math.sqrt(dirx*dirx+diry*diry);
	this.time=opt.time;
	var timestep=1;
	//add time correction
	this.direction.x=dirx/l/timestep;
	this.direction.y=diry/l/timestep;
	
	this.health=obj.health || this.health;
	this.shield=obj.shield || this.shield;
	this.level=obj.level || this.level;
}

Npc.prototype.proceed= function (){
	this.grid.x+=this.direction.x;
	this.grid.y+=this.direction.y;
	
	this.position=this.map.gridToScreen(this.grid.x,this.grid.y);
	this.depth=this.map.objDepth(this.grid.x,this.grid.y);
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
