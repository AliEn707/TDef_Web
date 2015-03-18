
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

