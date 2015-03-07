//for create eval("new "+obj.objtype+"(obj)")

var Tower_callbacks={
	walkleft:{
	},
	deathleft:{
		endAnimation:"remove",
	},
	deathleft:{
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
	this.grid=opt.grid || {x: 0,y: 0};
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.destination= opt.grid || {x: 0,y: 0};
	this.direction={x:0,y:0};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=opt.time || 0;
	this.dest_time=opt.time || 0;
	this.depth=this.map.objDepth(this.grid.y,this.grid.x);
	this.addChild(this.sprites[this.sprite]);
	
}
Tower.prototype= new PIXI.SpriteBatch()//DisplayObjectContainer();
Tower.prototype.constructor= Tower;


Tower.prototype.update= function (obj){

}

Tower.prototype.proceed= function (){

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

