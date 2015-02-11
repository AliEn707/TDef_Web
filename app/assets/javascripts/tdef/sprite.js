function Sprite(options){
	var frame=0;
	var tick=0;
	var tpf=options.tpf || 0;
	var frames=options.frames || 1;
	var loop=options.loop || 0;
	var context=options.context;
	var width=options.width;
	var height=options.height;
	var image=options.image;
	var scale=options.scale || 1;
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

Sprite.prototype.render=function (x,y){
	// Draw the animation
	this.context.drawImage(
			this.image,
			this.frame * this.width / this.frames,
			0,
			this.width / this.frames,
			this.height,
			x,
			y,
			this.width / this.frames*this.scale,
			this.height*this.scale);
}