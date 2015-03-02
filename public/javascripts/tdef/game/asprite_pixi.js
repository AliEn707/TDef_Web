
function ASprite(textures,params){
	PIXI.Sprite.call(this, texture[0]);
	params=params || {}
	this.current_frame=params.current_frame || 0
	this.frames=textures
	this.loop = params.loop || true
	this.updateFrame();
	this.count=params.count || 1;
	this.countStep=params.countStep || 0.25;
	this.counter=0;
	if (params.width)
		this.width=params.width;
	if (params.height)
		this.height=params.height;
	if (params.anchor)
		this.anchor=params.anchor;
	
}
ASprite.prototype=new PIXI.Sprite()
ASprite.prototype.constructor= ASprite

ASprite.prototype.getTexture= function (i){
	if (i)
		return this.frames[i];
	else
		return this.texture;
}
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

ASprite.prototype.upFrame= function (n){
	this.counter+=this.countStep;
	if (this.counter>=this.count){
		this.counter=0;
		this.nextFrame();
	}
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


function getTextureFrames(opt){
	var a=[];
//	for (var i in opt){
		var base=new PIXI.BaseTexture.fromImage(opt.src);
		var size=opt.frameSize || base.height;
		var frames=opt.frames || base.width/size;
//		a[i]=[];
		for(var j=0;j<frames;j++){
			a.push(new PIXI.Texture(base, new PIXI.Rectangle(size*j, 0, size, size)));
		}
//	}
	return a;
}


