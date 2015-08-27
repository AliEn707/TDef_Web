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
	this.type=opt.type != undefined ? opt.type : 1;
	this.owner=opt.owner || 0;
	this.grid=this.map.getPosition(opt.position || 3);
	this.grid.x=this.grid.x/this.map.nodesize+0.5;
	this.grid.y=this.grid.y/this.map.nodesize+0.5;
//	this.position=this.map.gridToScreen(this.grid.x,this.grid.y);
	var textures=tower_types[this.type].textures;
	this.sprites={};
	var s=this.map.nodesize*1.4*(opt.scale || 1);
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:0.72},callbacks:{obj:this,actions:Tower_callbacks[i]||{}},loop:textures[i].loop,delays:textures[i].delays,width:s,height:s});
	}
	this.setHealthSprite(s);
	
	//changeble
	this.sprite="idle";
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.depth=this.map.objDepth(this.grid.x,this.grid.y);
	this.addChildAt(this.sprites[this.sprite],0);
}
Tower.prototype= new PIXI.DisplayObjectContainer();
Tower.prototype.constructor= Tower;


Tower.prototype.setHealth= function (health){
	this.health=health;
	var type_health=this.type>0 ? tower_types[this.type].health : this.engine.map.players[this.owner].type.base.health;
	var obj=this.health/type_health;
	if (obj>1)
		obj=1;
	this.health_sprite.texture.setFrame({x:0,y:0,width:this.engine.textures.health.base.width*obj,height:this.engine.textures.health.base.height});
	this.health_sprite.tint=healthColor(obj);
}
Tower.prototype.update= function (obj){
	if (obj.health!=undefined)
		this.setHealth(obj.health);
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

Tower.prototype.setHealthSprite= function (s){
	var that=this;
	this.health_sprite=new PIXI.Sprite(new PIXI.Texture(this.engine.textures.health.base));
	var func=function (){
		that.health_sprite.height=that.health_sprite.height/that.health_sprite.width*that.map.nodesize;
		that.health_sprite.width=that.map.nodesize;
		that.health_sprite.position.y=-s*0.8;
		that.health_sprite.position.x=-that.health_sprite.width*0.5;
	}
	if (this.health_sprite.texture.baseTexture.hasLoaded)
		func();
	else
		this.health_sprite.texture.addEventListener("update", func);
	this.health_sprite.anchor.x=0;
	this.health_sprite.anchor.y=1;
	this.health_sprite.tint=healthColor(1);
	this.addChild(this.health_sprite);
}

Tower.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	this.addChildAt(this.sprites[this.sprite],0);
}

Tower.prototype.remove= function (){
	var engine=this.engine;
	engine.stage.removeChild(this);
	delete engine.map.objects[this.id];
}

