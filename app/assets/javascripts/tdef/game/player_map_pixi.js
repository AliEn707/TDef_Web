/*
some temp data
({id:1,players:5,latency:263})
([{msg:1,id:4,objtype:"Npc",create:1,owner:1,type:0,grid:{$:0,x:27.5,y:28.5},$:0,level:0,health:400,shield:200,time:21454},])
([{msg:2,id:3,objtype:"Tower",create:1,type:0,owner:1,position:868,target:-1,level:0,health:2000,shield:0,time:21463},
	{msg:4,id:1,objtype:"Player",pid:2,
		tower_set:{$:0,0:{$:0,id:1,size:-1},$:0,1:{$:0,id:2,size:-1},$:0,2:{$:0,id:3,size:-1},$:0,3:{$:0,id:4,size:-1},$:0,4:{$:0,id:5,size:-1},$:0,5:{$:0,id:6,size:-1},$:0,6:{$:0,id:7,size:-1},$:0,7:{$:0,id:8,size:-1},$:0,8:{$:0,id:9,size:-1},$:0},$:0,
		npc_set:{$:0,0:{$:0,id:1,size:-1},$:0,1:{$:0,id:2,size:-1},$:0,2:{$:0,id:3,size:-1},$:0,3:{$:0,id:4,size:-1},$:0,4:{$:0,id:5,size:-1},$:0,5:{$:0,id:6,size:-1},$:0,6:{$:0,id:7,size:-1},$:0,7:{$:0,id:8,size:-1},$:0,8:{$:0,id:9,size:-1},$:0},$:0,
		group:1,
		_hero_counter:496,
		base:3,
		base_type:{$:0,health:2000},$:0,
		hero_type:{$:0,health:400,shield:200},$:0,
		hero:4,
		hero_counter:1,
		health:2000,
		money:1000,
		target:0,
		time:21494},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21504},{msg:2,id:3,objtype:"Tower",time:21504},{msg:4,id:1,objtype:"Player",time:21555},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21565},{msg:2,id:3,objtype:"Tower",time:21565},{msg:4,id:1,objtype:"Player",time:21656},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21667},{msg:2,id:3,objtype:"Tower",time:21667},{msg:4,id:1,objtype:"Player",time:21728},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21738},{msg:2,id:3,objtype:"Tower",time:21738},{msg:4,id:1,objtype:"Player",time:21799},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21809},{msg:2,id:3,objtype:"Tower",time:21809},{msg:4,id:1,objtype:"Player",time:21870},])
*/
function MapPlayer(opt){
	opt=opt || {};
	this.type={}
	this.set={}
	this.set.tower=opt.tower_set;
	this.set.npc=opt.npc_set;
	this.id=opt.pid; //real id from base
	this.group=opt.group;
	this.full_hero_counter=opt["_hero_counter"];
	this.hero_counter=opt.hero_counter;
	this.type.hero=opt.hero_type;
	for (var i in TDef.types.npc[0])
		if (!this.type.hero[i])
			this.type.hero[i]=TDef.types.npc[0][i];//change to real properties
	this.type.base=opt.base_type;
	for (var i in TDef.types.tower[0])
		if (!this.type.base[i])
			this.type.base[i]=TDef.types.tower[0][i];//change to real properties
	this.base=opt.base;
	this.hero=opt.hero;
	this.targeting=opt.targeting;
	
		var engine=getEngine();
	
	//TODO:remove	
	var t=[new PIXI.Texture.fromImage("/imgtest/red.jpeg")]
	var tw=[new PIXI.Texture.fromImage("/imgtest/green.jpg")]
	
	if (engine.map.players.id==this.id){
		var buttonSize={x:50,y:50}
		var cont=getTextureFrames(engine.textures.npc_set_background);
		var size={width:buttonSize.x+2*5, height:buttonSize.y*9+10*5}
		var buttons=new ButtonContainer({
			sprite:{
				textures:cont,
				opt:size
			},
			position:{
				x:0,
				y:engine.renderer.height/2-(buttonSize.y*9+10*5)/2,
			},
			actions:["drag"]
		});
		buttons.keyPadInit({rows: 9, columns: 1, buttonSize: buttonSize, buttonDist:{x:5,y:5}});
		for(var i in this.set.npc)
			if (parseInt(i) || parseInt(i)==0){
				this.set.npc[i].button=buttons.keyPadAddButton({sprite:{textures: t,opt:{}},actions:["press"], args: parseInt(i), pressAction:function(){mapSpawnNpc(this.args);}});
			}
		this.set.npc.buttons=buttons;
		engine.map.objects["npc_set"]=buttons;
		engine.stage.addChild(buttons);
		
		cont=getTextureFrames(engine.textures.tower_set_background);
		buttonSize={x:50,y:50}
		size={width:buttonSize.x+2*5,height:buttonSize.y*9+10*5}
		buttons=new ButtonContainer({
			sprite:{
				textures:cont,
				opt:size
			},
			position:{
				x:100,
				y:200
			},
			actions:["drag"]
		});
		buttons.keyPadInit({rows: 9, columns: 1, buttonSize: buttonSize, buttonDist:{x:5,y:5}});
		for(var i in this.set.tower)
			if (parseInt(i) || parseInt(i)==0){
				this.set.tower[i].button=buttons.keyPadAddButton({sprite:{textures: tw,opt:{}},actions:["press"], args: parseInt(i), pressAction:function(){var z=this.args;engine.map.setAction(function (id){var t=z;mapSpawnTower(t,id);})}});
			}
		this.set.tower.buttons=buttons;
		engine.map.objects["tower_set"]=buttons;
		engine.stage.addChild(buttons);
	}
	
}

MapPlayer.prototype.constructor= MapPlayer;


MapPlayer.prototype.update= function (opt){
	if (opt.base!=undefined)
		this.base=opt.base;
	if (opt.hero!=undefined)
		this.hero=opt.hero;
	this.hero_counter=opt.hero_counter;
	this.targeting=opt.targeting;
}

MapPlayer.prototype.proceed= function (){

}


MapPlayer.prototype.remove= function (){
	
}

