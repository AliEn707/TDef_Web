function Npc(opt){
	opt=opt || {};
	//static
	this.sprite=opt.sprite;
	this.type=opt.type || 0;
	//changeble
	this.position={x:opt.x || 0,y:opt.y || 0};
	this.destination={x:opt.x || 0,y:opt.y || 0};
	this.direction={x:0,y:0};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=0;
	
}
Npc.prototype=new PIXI.Sprite();
Npc.prototype.constructor= Npc;


Npc.prototype.update= function (obj){
	var time=this.time;
	var dirx=(obj.x-this.position.x);
	var diry=(obj.y-this.position.y);
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
	this.position.x+=this.direction.x;
	this.position.y+=this.direction.y;
	
	
}

