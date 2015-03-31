//for create eval("new "+obj.objtype+"(obj)")

var Bullet_callbacks={
}

function Bullet(opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.map=getEngine().map;
	//static
	this.id=opt.id || 0
	this.type=opt.type || 1;
	var textures=bullet_types[this.type].textures;
	this.sprites={};
	for (var i in textures){
		if (!textures[i]["texture"])
			textures[i]["texture"]=getTextureFrames(textures[i]);
		var s=this.map.nodesize*0.4*(opt.scale || 1);
		sprite=new ASprite(textures[i]["texture"],{anchor:{x:0.5,y:0.5},callbacks:{obj:this,actions:Bullet_callbacks[i]||{}},loop:textures[i].loop,width: s/4,height: s});
		if (bullet_types[this.type].solid){
			this.sprites[i]=new ATilingSprite(textures[i]["texture"],{anchor:{x:0.5,y:1},callbacks:{obj:this,actions:Bullet_callbacks[i]||{}},loop:textures[i].loop, width:textures[i].width, height:textures[i].height, size:s});
			this.sprites[i].scale=sprite.scale;
		}else{
			this.sprites[i]=sprite
		}
	}
	//changeble
	this.sprite="idle";
	this.grid=opt.grid || {x: 0,y: 0};
	this.position=this.map.gridToScreen(this.grid.y,this.grid.x);
	this.source= opt.source || {x: 0,y: 0};
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
Bullet.prototype= new PIXI.DisplayObjectContainer();
Bullet.prototype.constructor= Bullet;


Bullet.prototype.getLength= function (source,position){
	var v={x:position.x-source.x,y:position.y-source.y};
	return Math.sqrt(v.x*v.x+v.y*v.y);
}

Bullet.prototype.getAngle= function (source,position){
	var v={x:position.x-source.x,y:position.y-source.y};
	var length=Math.sqrt(v.x*v.x+v.y*v.y);
	var angle=length!=0 ? Math.acos((-v.y)/(length)) : 0;
	return angle;
}

Bullet.prototype.update= function (obj){
	var dirx=(obj.grid.x-this.grid.x);//(obj.grid.x-this.grid.x);
	var diry=(obj.grid.y-this.grid.y);//(obj.grid.y-this.grid.y);
	var l=Math.sqrt(dirx*dirx+diry*diry);
	var timestep=1;
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
	
	//set rotation
	var position=this.map.gridToScreen(obj.grid.y,obj.grid.x);
	//TODO check maybe not need
	var source=this.map.gridToScreen(this.source.y,this.source.x);
	this.rotation=this.getAngle(source,position);
	
	this.time=obj.time;
	if (bullet_types[this.type].solid){
		this.grid=obj.grid;
	}
	
	if (obj.detonate){
		//TODO add boom sprite
		this.remove();
	}
}

Bullet.prototype.proceed= function (){
	
	if (bullet_types[this.type].solid){
		this.position=this.map.gridToScreen(this.source.y, this.source.x);
		this.setHeight(this.getLength(this.position,this.map.gridToScreen(this.grid.y, this.grid.x)));
	}else{		
		this.grid.x+=this.direction.x//*bullet_types[this.type].move_speed*6/100;
		this.grid.y+=this.direction.y//*bullet_types[this.type].move_speed*6/100;
		this.position=this.map.gridToScreen(this.grid.y, this.grid.x);
	}
		this.position.y-=0.3*this.map.nodesize*this.map.scale.x;
		this.depth=this.map.objDepth(this.grid.y,this.grid.x);
		this.sprites[this.sprite].upFrame();
		this.scale.x=this.map.scale.x;
		this.scale.y=this.map.scale.x;
}

Bullet.prototype.setHeight= function (w){
	this.sprites[this.sprite].setHeight(w);
}

Bullet.prototype.setSprite= function (name){
	this.removeChild(this.sprites[this.sprite]);
	this.sprite=name;
	this.addChild(this.sprites[this.sprite]);
}

Bullet.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.mapObjects[this.id];
}

