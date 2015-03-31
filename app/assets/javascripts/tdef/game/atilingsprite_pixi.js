
function ATilingSprite(textures,params){
	params=params || {}
	params.width=params.width || textures[0].width;
	params.height=params.height || textures[0].height;

//	PIXI.TilingSprite.call(this, texture[0], params.width, params.height);
	PIXI.DisplayObjectContainer.call(this);
	this.engine=getEngine() || {frameTime:1000/30};
	this.current_frame=params.current_frame || 0;
	this.frames=[];
	for (var i in textures){
		this.frames[i]=new PIXI.TilingSprite(textures[i], params.width, params.height);
		if (params.anchor)
			this.frames[i].anchor=params.anchor;
	}
	this.loop = params.loop || true;
	this.count=params.count || 1;
	this.countStep=params.countStep || 13*this.engine.frameTime/1000;//0.2;
	this.counter=0;
	this.callbacks=params.callbacks || {obj:{}}
	this.callbacks.actions= this.callbacks.actions || {}
	this.srcSize=params.size || this.engine.map.nodesize;
	if (params.width)
		this.srcWidth=params.width;
	if (params.height)
		this.srcHeight=params.height;
	
	this.addChild(this.frames[this.current_frame]);
//	this.updateFrame();
	
}
ATilingSprite.prototype=new PIXI.DisplayObjectContainer();//new PIXI.TilingSprite()
ATilingSprite.prototype.constructor= ATilingSprite

ATilingSprite.prototype.setHeight= function (height){
	if (height){
		console.log(height/this.engine.map.nodesize/this.engine.map.scale.x)
		this.frames[this.current_frame].height=height*this.srcHeight/(this.srcSize*this.engine.map.scale.x);
	}
}

ATilingSprite.prototype.getTexture= function (i){
	if (i)
		return this.frames[i].texture;
	else
		return this.frames[this.current_frame].texture;
}

ATilingSprite.prototype.setFrame= function (n,texture){
	this.frames[n]=new PIXI.TilingSprite(texture, this.srcWidth, this.srcHeight)
	if (this.current_frame==n)
		this.updateFrame();
}

ATilingSprite.prototype.updateFrame= function (){
	var height;
	var cur=this.getChildAt(0);
	height=cur.height;
	this.removeChild(cur);
	this.frames[this.current_frame].height=height;
	this.addChild(this.frames[this.current_frame]);

//	this.setTexture(this.frames[this.current_frame])
//	this.texture=this.frames[this.current_frame]
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

ATilingSprite.prototype.prevFrame= function (n){
	if (this.current_frame>0){
		this.current_frame--
		this.updateFrame()
	}
}


