/*
textures 
[ ]-array of textures
params
{
	//passed for AObject
opt	current_frame: int;
opt	loop: boolean;
opt	callbacks: {
		obj:{ } - object contaning actions for this pbject
		actions: {
			endAnimation: string;
		} - containing names of actions
	}
opt	delays: {
		last_frame: int;
	}
	//used here
opt	width: int;
opt	height: int;
opt	anchor: {x: int ,y: int};
}

*/
function ASprite(textures,params){
	params=params || {}
	AObject.call(this, params);
	this.setFrames(textures, params);
	this.addChild(this.frames[this.current_frame]);
}
ASprite.prototype=new AObject();
ASprite.prototype.constructor= ASprite

ASprite.prototype.setHeight= function (height){ }

ASprite.prototype.setFrames= function (textures, params){
	this.frames=[];
	var keys=["width","height","anchor","tint"]
	for (var i in textures){
		this.frames[i]=new PIXI.Sprite(textures[i]);
		for (var j in keys)
			if (params[keys[j]])
				this.frames[i][keys[j]]=params[keys[j]];
	}
}

ASprite.prototype.setFrame= function (n,texture){
	this.frames[n]=texture
	if (this.current_frame==n)
		this.updateFrame()
}




