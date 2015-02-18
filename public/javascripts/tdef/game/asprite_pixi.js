

function ASprite(texture,params){
	PIXI.Sprite.call(this, texture);
	params=params || {}
	this.current_frame=params.current_frame || 0
	
	this.frames=[texture]
	this.loop = params.loop || true
	
}
ASprite.prototype=new PIXI.Sprite()
ASprite.prototype.constructor= ASprite


ASprite.prototype.setFrame= function (n,texture){
	this.frames[n]=texture
	if (this.current_frame==n)
		this.updateFrame()
}

ASprite.prototype.updateFrame= function (){
	this.texture=this.frames[this.current_frame]
}

ASprite.prototype.chooseFrame= function (n){
	this.current_frame=n
	this.updateFrame()
}

ASprite.prototype.nextFrame= function (n){
	this.current_frame++
	if (this.current_frame==this.frames.length){
		if (this.loop)
			this.current_frame=0
		else
			this.current_frame--
	}
	this.updateFrame()
}

ASprite.prototype.prevFrame= function (n){
	if (this.current_frame>0){
		this.current_frame--
		this.updateFrame()
	}
}

