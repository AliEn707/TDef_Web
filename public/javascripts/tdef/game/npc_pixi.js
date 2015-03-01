//for create eval("new "+obj.objtype+"(obj,grid)")
function Npc(grid,opt){
	opt=opt || {};
	this.map=grid;
	//static
	this.sprite=opt.sprite;
	this.type=opt.type || 0;
	//changeble
	this.grid={x:opt.x || 0,y:opt.y || 0};
	this.position=grid.gridToScreen(this.grid.x,this.grid.y);
	this.destination={x:opt.x || 0,y:opt.y || 0};
	this.direction={x:this.grid.x,y:this.grid.y};
	this.level=opt.level || 0;
	this.health=opt.health || 0;
	this.shield=opt.shield || 0;
	this.energy=opt.energy || 0;
	this.time=0;
	this.depth=grid.objDepth(this.grid.x,this.grid.y);
//	this.addChild(this.sprite);
}
Npc.prototype= new PIXI.DisplayObjectContainer()
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
	this.depth=grid.objDepth(this.grid.x,this.grid.y);
	//proseed sprite
	
}

