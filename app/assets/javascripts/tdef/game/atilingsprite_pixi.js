
function ATilingSprite(textures,params){
	AObject.call(this,params);

	this.srcSize=params.size;
	if (this.engine.map)
		this.srcSize=this.srcSize || this.engine.map.nodesize;
	this.srcWidth=params.width || textures[0].width;
	this.srcHeight=params.height || textures[0].height;
	
	this.setFrames(textures, params);
	
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
		this.frames[i].height=value;
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
		this.frames[i].width=value;
    }
});
/*
Object.defineProperty(ATilingSprite.prototype, 'scale', {
    get: function() {
		return  this.scale;
    },
    set: function(value) {
	var scale=this.scale || {x:1,y:1};
	this.scale=value;
	this.width=this.width*value.x/scale.x;
	this.height=this.width*value.x/scale.x;
	var that=this;
	Object.defineProperty(this.scale, 'x', {
	    get: function() {
		return that.cale.x;
	    },
	    set: function(value) {
		var x=that.scale.x;
		that.scale.x=value.x;    
		that.width=that.width*value.x/x;
	    }
	});
	Object.defineProperty(this.scale, 'y', {
	    get: function() {
		return that.cale.y;
	    },
	    set: function(value) {
		var y=that.scale.y;
		that.scale.y=value.y;    
		that.height=that.height*value.y/y;
	    }
	});

    }
});
*/
