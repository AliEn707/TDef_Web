/*
some temp data
({id:1,players:5,latency:263})
([{msg:1,id:4,objtype:"Npc",create:1,owner:1,type:0,grid:{$:0,x:27.5,y:28.5},$:0,level:0,health:400,shield:200,time:21454},])
([{msg:2,id:3,objtype:"Tower",create:1,type:0,owner:1,position:868,target:-1,level:0,health:2000,shield:0,time:21463},{msg:4,id:1,objtype:"Player",pid:2,tower_set:{$:0,0:{$:0,id:1,size:-1},$:0,1:{$:0,id:2,size:-1},$:0,2:{$:0,id:3,size:-1},$:0,3:{$:0,id:4,size:-1},$:0,4:{$:0,id:5,size:-1},$:0,5:{$:0,id:6,size:-1},$:0,6:{$:0,id:7,size:-1},$:0,7:{$:0,id:8,size:-1},$:0,8:{$:0,id:9,size:-1},$:0},$:0,npc_set:{$:0,0:{$:0,id:1,size:-1},$:0,1:{$:0,id:2,size:-1},$:0,2:{$:0,id:3,size:-1},$:0,3:{$:0,id:4,size:-1},$:0,4:{$:0,id:5,size:-1},$:0,5:{$:0,id:6,size:-1},$:0,6:{$:0,id:7,size:-1},$:0,7:{$:0,id:8,size:-1},$:0,8:{$:0,id:9,size:-1},$:0},$:0,group:1,_hero_counter:496,base:3,base_type:{$:0,health:2000},$:0,hero_type:{$:0,health:400,shield:200},$:0,hero:4,hero_counter:1,health:2000,money:1000,target:0,time:21494},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21504},{msg:2,id:3,objtype:"Tower",time:21504},{msg:4,id:1,objtype:"Player",time:21555},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21565},{msg:2,id:3,objtype:"Tower",time:21565},{msg:4,id:1,objtype:"Player",time:21656},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21667},{msg:2,id:3,objtype:"Tower",time:21667},{msg:4,id:1,objtype:"Player",time:21728},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21738},{msg:2,id:3,objtype:"Tower",time:21738},{msg:4,id:1,objtype:"Player",time:21799},])
([{msg:1,id:4,objtype:"Npc",grid:{$:0,x:27.5,y:28.5},$:0,time:21809},{msg:2,id:3,objtype:"Tower",time:21809},{msg:4,id:1,objtype:"Player",time:21870},])
*/
function Player(opt){
	opt=opt || {};

	
}

Player.prototype.constructor= Player;


Player.prototype.update= function (obj){

}

Player.prototype.proceed= function (){

}


Player.prototype.remove= function (){
	var engine=getEngine();
	engine.stage.removeChild(this);
	delete engine.mapObjects[this.id];
}

