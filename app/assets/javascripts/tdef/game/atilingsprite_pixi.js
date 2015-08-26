
function ATilingSprite(textures,params){
	AObject.call(this,params);

	this.srcSize=params.size;
	if (this.engine.map)
		this.srcSize=this.srcSize || this.engine.map.nodesize;
	this.srcWidth=params.width || textures[0].width;
	this.srcHeight=params.height || textures[0].height;
	
	this.setFrames(textures, params);
	
	this.width=this.srcWidth;
	this.height=this.srcHeight;
	this.addChild(this.frames[this.current_frame]);
//	this.updateFrame();
	
}
ATilingSprite.prototype=new AObject();//new PIXI.TilingSprite()
ATilingSprite.prototype.constructor= ATilingSprite

ATilingSprite.prototype.setHeight= function (height){
	if (height && this.engine.map){
		for (var i in this.frames)
			this.frames[i].height=height*this.srcHeight/(this.srcSize*this.engine.map.scale.x);
	}
}

ATilingSprite.prototype.setFrames= function (textures, params){
	this.frames=[];
	for (var i in textures){
		this.frames[i]=new PIXI.TilingSprite(textures[i], this.srcWidth, this.srcHeight);
		if (params.anchor)
			this.frames[i].anchor=params.anchor;
		if (params.scale)
			this.frames[i].scale=params.scale;
	}
}

ATilingSprite.prototype.setFrame= function (n,texture){
	this.frames[n]=new PIXI.TilingSprite(texture, this.srcWidth, this.srcHeight)
	if (this.current_frame==n)
		this.updateFrame();
}

Object.defineProperty(ATilingSprite.prototype, 'height', {
    get: function() {
	var t=this.frames[this.current_frame];
	if (t)
		return  t.height;
    },
    set: function(value) {
	for (var i in this.frames)
		this.frames[i].height=value/this.frames[i].scale.y;
    }
});

Object.defineProperty(ATilingSprite.prototype, 'width', {
    get: function() {
	var t=this.frames[this.current_frame];
	if (t)
		return  t.width;
    },
    set: function(value) {
	for (var i in this.frames)
		this.frames[i].width=value/this.frames[i].scale.x;
    }
});

Object.defineProperty(ATilingSprite.prototype, 'realWidth', {
    get: function() {
	var t=this.frames[this.current_frame];
	if (t)
		return  t.width*t.scale.x;
    },
    set: function(value) {
   }
});

Object.defineProperty(ATilingSprite.prototype, 'realHeight', {
    get: function() {
	var t=this.frames[this.current_frame];
	if (t)
		return  t.height*t.scale.y;
    },
    set: function(value) {
    }
});

/*
Object.defineProperty(ATilingSprite.prototype, 'scale', {
    get: function() {
	var t=this.frames[this.current_frame];
	if (t)
		return  t.scale;
    },
    set: function(value) {
	for (var i in this.frames){
		this.frames[i].scale.x=value.x;
		this.frames[i].scale.y=value.y;
	}
    }
});

*/
