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
	this.map=getEngine().map;
	//static
	this.id=opt.id || 0
	this.type=opt.type || 1;
	this.owner=opt.owner || 0;
	this.grid=this.map.getPosition(opt.position);
	this.grid.x/=this.map.nodesize;
	this.grid.y/=this.map.nodesize;
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	var textures=tower_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*(opt.scale || 1);
		this.sprites[i]=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:1},callbacks:{obj:this,actions:Tower_callbacks[i]||{}},loop:textures[i].loop,width:s,height:s});
	}
	//changeble
	this.sprite="idle";
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
	this.addChild(this.sprites[this.sprite]);
	
}
Tower.prototype= new PIXI.SpriteBatch()//DisplayObjectContainer();
Tower.prototype.constructor= Tower;


Tower.prototype.update= function (obj){

}

Tower.prototype.proceed= function (){
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.sprites[this.sprite].upFrame();
}

Tower.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	this.addChild(this.sprites[this.sprite]);
}

Tower.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.mapObjects[this.id];
}

