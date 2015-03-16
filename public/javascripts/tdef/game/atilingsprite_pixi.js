
function ATilingSprite(textures,params){
	params=params || {}
	params.width=params.width || textures[0].width;
	params.height=params.height || textures[0].height;

	PIXI.TilingSprite.call(this, texture[0], params.width, params.height);
	this.engine=getEngine() || {frameTime:1000/30};
	this.current_frame=params.current_frame || 0
	this.frames=textures
	this.loop = params.loop || true
	this.updateFrame();
	this.count=params.count || 1;
	this.countStep=params.countStep || 13*this.engine.frameTime/1000;//0.2;
	this.counter=0;
	this.callbacks=params.callbacks || {obj:{}}
	this.callbacks.actions= this.callbacks.actions || {}
	if (params.width)
		this.srcWidth=params.width;
	if (params.height)
		this.srcHeight=params.height;
	if (params.anchor)
		this.anchor=params.anchor;
}
ATilingSprite.prototype=new PIXI.TilingSprite()
ATilingSprite.prototype.constructor= ATilingSprite

ATilingSprite.prototype.setHeight= function (height){
	if (height){
		this.height=height*this.srcHeight/(this.engine.map.nodesize*this.engine.map.scale.x);
	}
}

ATilingSprite.prototype.getTexture= function (i){
	if (i)
		return this.frames[i];
	else
		return this.texture;
}
ATilingSprite.prototype.setFrame= function (n,texture){
	this.frames[n]=texture
	if (this.current_frame==n)
		this.updateFrame()
}

ATilingSprite.prototype.updateFrame= function (){
	this.setTexture(this.frames[this.current_frame])
}

ATilingSprite.prototype.chooseFrame= function (n){
	this.current_frame=n
	this.updateFrame()
}

ATilingSprite.prototype.upFrame= function (n){
	this.counter+=this.countStep;
	if (this.counter>=this.count){
		this.counter=0;
		this.nextFrame();
	}
}

ATilingSprite.prototype.nextFrame= function (n){
	this.current_frame++
	if (this.current_frame==this.frames.length){
		if (this.loop)
			this.current_frame=0
		else{
			this.current_frame--
			if (this.callbacks.obj[this.callbacks.actions.endAnimation])
				this.callbacks.obj[this.callbacks.actions.endAnimation]();
		}
	}
	this.updateFrame()
}

ATilingSprite.prototype.prevFrame= function (n){
	if (this.current_frame>0){
		this.current_frame--
		this.updateFrame()
	}
}


