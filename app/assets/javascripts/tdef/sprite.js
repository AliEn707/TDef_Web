function Sprite(options){
	this.frame=0;
	this.tick=0;
	this.tpf=options.tpf || 1;
	this.frames=options.frames || 1;
	this.loop=options.loop || 0;
	this.image=options.image;
	this.width=options.image.width || this.image.width || options.width;
	this.height=options.image.height || this.image.height || options.height;
	this.scale=options.scale || 1;
}

Sprite.prototype.update=function (){
	if (this.tick > this.tpf) {
		this.tick = 0;
		// If the current frame index is in range
		if (this.frame < this.frames - 1) {	
			// Go to the next frame
			this.frame += 1;
		} else 
			if (this.loop==1)
				this.frame = 0;
	}else
		this.tick += 1;
}

Sprite.prototype.draw=function (context,x,y,opt){
	x=x || 0
	y=y || 0
	var _width=this.width / this.frames
	var widthneed=opt.width || _width
	var scalew=widthneed / _width * this.scale
	var width=_width*scalew
	
	var _height=this.height 
	var heightneed=opt.height || _height
	var scaleh=heightneed / _height * this.scale
	var height=_height * scaleh
	
	// Draw the animation
	context.drawImage(
			this.image,
			this.frame * _width,
			0,
			_width,
			_height,
			x,
			y,
			width,
			height);
}