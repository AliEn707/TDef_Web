/*
textures 
[ ]-array of textures
params
{
	//passed for AObject
opt	current_frame: int;
opt	loop: boolean;
opt	countStep: float;
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
	for (var i in textures){
		this.frames[i]=new PIXI.Sprite(textures[i]);
		if (params.width)
			this.frames[i].width=params.width;
		if (params.height)
			this.frames[i].height=params.height;
		if (params.anchor)
			this.frames[i].anchor=params.anchor;
	}
}

ASprite.prototype.setFrame= function (n,texture){
	this.frames[n]=texture
	if (this.current_frame==n)
		this.updateFrame()
}




