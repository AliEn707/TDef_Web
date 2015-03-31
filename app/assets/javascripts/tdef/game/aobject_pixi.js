
function AObject(params){
	params=params || {}
	
//	PIXI.TilingSprite.call(this, texture[0], params.width, params.height);
	PIXI.DisplayObjectContainer.call(this);
	this.current_frame=params.current_frame || 0;
	this.loop = params.loop || true;
	this.count=params.count || 1;
	this.countStep=params.countStep; //0.2;
	this.counter=0;
	this.callbacks=params.callbacks || {obj:{}}
	this.callbacks.actions= this.callbacks.actions || {}
	
	
//	this.updateFrame();
	
}
AObject.prototype=new PIXI.DisplayObjectContainer();//new PIXI.TilingSprite()
AObject.prototype.constructor= AObject

AObject.prototype.getTexture= function (i){
	if (i)
		return this.frames[i].texture;
	else
		return this.frames[this.current_frame].texture;
}

AObject.prototype.updateFrame= function (){
	//height must be setted manualy
//	var height;
	var cur=this.getChildAt(0);
//	height=cur.height;
	this.removeChild(cur);
//	this.frames[this.current_frame].height=height;
	this.addChild(this.frames[this.current_frame]);

//	this.setTexture(this.frames[this.current_frame])
//	this.texture=this.frames[this.current_frame]
}

AObject.prototype.chooseFrame= function (n){
	this.current_frame=n
	this.updateFrame()
}

AObject.prototype.upFrame= function (n){
	this.counter+=this.countStep;
	if (this.counter>=this.count){
		this.counter=0;
		this.nextFrame();
	}
}

AObject.prototype.nextFrame= function (n){
	var prev=this.current_frame
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

AObject.prototype.prevFrame= function (n){
	if (this.current_frame>0){
		this.current_frame--
		this.updateFrame()
	}
}

AObject.prototype.getScale= function (){
	return this.frames[this.current_frame].scale;
}

function getTextureFrames(opt){
	var a=[];
//	for (var i in opt){
		var base=new PIXI.BaseTexture.fromImage(opt.src);
		var height=opt.height || base.height;
		var width=opt.width || height;
		var frames=opt.frames || base.width/size;
//		a[i]=[];
		for(var j=0;j<frames;j++){
			a.push(new PIXI.Texture(base, new PIXI.Rectangle(width*j, 0, width, height)));
		}
//	}
	return a;
}
