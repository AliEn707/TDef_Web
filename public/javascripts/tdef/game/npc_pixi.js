function Npc(opt){
	opt=opt || {};
	
	var position={x:opt.x || 0,y:opt.y || 0};
	var destination={x:opt.x || 0,y:opt.y || 0};
	var direction={x:0,y:0};
	var level=opt.level || 0;
	var health=opt.health || 0;
	var shield=opt.shield || 0;
	int energy=opt.energy || 0;
	var texture=opt.texture;
	var type=opt.type || 0;
	var time=0;
	
}
Npc.prototype=new PIXI.Sprite();
Npc.prototype.constructor= Npc;


Npc.prototype.update= function (obj){
	var time=this.time;
	var dirx=(obj.x-this.position.x);
	var diry=(obj.y-this.position.y);
	var l=Math.sqrt(dirx*dirx+diry*diry);
	
	this.time=opt.time;
	//add time correction
	this.direction.x=dirx/l;
	this.direction.y=diry/l;
	
	
}

Npc.prototype.preceed= function (){
	this.position.x+=this.direction.x;
	this.position.y+=this.direction.y;
	
	
}
