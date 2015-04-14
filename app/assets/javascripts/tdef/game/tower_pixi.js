//for create eval("new "+obj.objtype+"(obj)")

var Tower_callbacks={
	walk_left:{
	},
	death_left:{
		endAnimation:"remove",
	},
	death_left:{
		endAnimation:"remove",
	}
}

function Tower(opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.engine=getEngine();
	this.map=this.engine.map;
	//static
	this.id=opt.id || 0;
	this.type=opt.type || 1;
	this.owner=opt.owner || 0;
	this.grid=this.map.getPosition(opt.position || 3);
	this.grid.x=this.grid.x/this.map.nodesize+0.5;
	this.grid.y=this.grid.y/this.map.nodesize+0.5;
//	this.position=this.map.gridToScreen(this.grid.x,this.grid.y);
	var textures=tower_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*1.4*(opt.scale || 1);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:0.72},callbacks:{obj:this,actions:Tower_callbacks[i]||{}},loop:textures[i].loop,delays:textures[i].delays,width:s,height:s});
	}
	//changeble
	this.sprite="idle";
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.depth=this.map.objDepth(this.grid.x,this.grid.y);
	this.addChild(this.sprites[this.sprite]);
	
}
Tower.prototype= new PIXI.DisplayObjectContainer();
Tower.prototype.constructor= Tower;


Tower.prototype.update= function (obj){
	if (!obj.health===undefined)
		this.health=obj.health;
	if (obj.health<=0 || this.health<=0)
		this.remove();
}

Tower.prototype.proceed= function (){
	this.position=this.map.gridToScreen(this.grid.x,this.grid.y);
	this.depth=this.map.objDepth(this.grid.x,this.grid.y);
	//proseed sprite
	this.sprites[this.sprite].upFrame();
	this.scale.x=this.map.scale.x;
	this.scale.y=this.map.scale.x;
}

Tower.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	this.addChild(this.sprites[this.sprite]);
}

Tower.prototype.remove= function (){
	var engine=this.engine;
	engine.stage.removeChild(this);
	delete engine.map.objects[this.id];
}

