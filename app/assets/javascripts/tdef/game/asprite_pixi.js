
function ASprite(textures,params){
	AObject.call(this, params);
	this.engine=getEngine() || {frameTime:1000/30};
	this.countStep=this.countStep || 13*this.engine.frameTime/1000;//0.2;
	
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




