function Map(obj){
	this.size=obj.size || 1
	this.grid=obj.grid || []
	this.textures= obj.textures || []
	this.nodesize=obj.nodesize || 1
	this.outernodes=obj.outernodes || []
	this.canvas=document.createElement('canvas')
	this.canvas.width=obj.ctx.canvas.width
	this.canvas.height=obj.ctx.canvas.height
//	WebGL2D.enable(this.canvas);
	this.ctx=this.canvas.getContext("2d");
//	this.ctx=this.canvas.getContext("2d", {alpha: false});
//	this.ctx=this.canvas.getContext("webgl-2d");
//	console.log(""+ctx.isWebGL)
	var scale=1
	this.transform={scale: obj.scale || scale, translate:{x: obj.x || 0,y: obj.y || 0},rotate: -45*Math.PI/180}
//	canvasParent.appendChild(this.canvas)
}

Map.prototype.gridToScreen=function (x, y){
	x=x||0
	y=y||0
	var nodeSize=this.nodesize
	return {x: this.transform.scale*nodeSize*(0.707*x + 0.707*y)+this.transform.translate.x,
			y:this.transform.scale*nodeSize*0.5*(0.707*y- 0.707*x) + this.transform.translate.y}
}

Map.prototype.screenToGrid=function (x, y){
	x=x||0
	y=y||0
	var sx=this.transform.scale
	var sy=this.transform.scale*0.5
	var tx=this.transform.translate.x
	var ty=this.transform.translate.y
	var nodeSize=this.nodesize
	return {x: (-(500*y)/(707*sy)+(500*x)/(707*sx)+(500*sx*ty-500*sy*tx)/(707*sx*sy))/nodeSize,
			y: ((500*y)/(707*sy)+(500*x)/(707*sx)-(500*sx*ty+500*sy*tx)/(707*sx*sy))/nodeSize}
}

Map.prototype.scale=function (s,x,y){
	s=s || 1
	var w=x || this.canvas.width/2
	var h=y || this.canvas.height/2
	var grd=this.screenToGrid(w,h)
	this.transform.scale*=s 
	var scr=this.gridToScreen(grd.x,grd.y)
	var shiftx=(scr.x-w)
	var shifty=(scr.y-h)
	this.translate(-shiftx,-shifty)
}

Map.prototype.translate=function (x,y){
	this.transform.translate.x+=x || 0
	this.transform.translate.y+=y || 0
}

Map.prototype.setCanvasParameters=function (s){
	this.canvas.width=s.width
	this.canvas.height=s.height
	this.update()
}

Map.prototype.transformCorrection=function(){
	var width=this.canvas.width
	var height=this.canvas.height
	
	var l=this.gridToScreen(0,0).x
	var d=this.gridToScreen(this.size,0).y
	var u=this.gridToScreen(0,this.size).y
	var r=this.gridToScreen(this.size,this.size).x
	var x=r-l;
	var y=u-d;
	var scale=1;
	if (x<(width) || y<(height)){
		if (x-(width)<y-(height))
			scale=(width)/x;
		else
			scale=(height)/y;
	}
	this.transform.scale*=scale;
	
	l=this.gridToScreen(0,0).x
	d=this.gridToScreen(this.size,0).y
	u=this.gridToScreen(0,this.size).y
	r=this.gridToScreen(this.size,this.size).x
	if (l>0){
		this.transform.translate.x-=l;
	}
	if (r<width){
		this.transform.translate.x-=r-(width);
	}
	if (u<height){
		this.transform.translate.y-=u-(height);
	}
	if (d>0){
		this.transform.translate.y-=d;
	}
	
}


//update map information 
//use if changes tranformation or window size
Map.prototype.update=function (){
	this.transformCorrection()
	var canvas=this.ctx.canvas
	this.ctx.setTransform( 1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0,0,canvas.width,canvas.height)
	this.ctx.setTransform( this.transform.scale, 0, 0, this.transform.scale*0.5, this.transform.translate.x, this.transform.translate.y);
//	this.ctx.translate(this.transform.translate.x, this.transform.translate.y);
//	this.ctx.scale(this.transform.scale,this.transform.scale/2);
	this.ctx.rotate(this.transform.rotate);
	var grid=this.grid
	var gridsize=this.size
	var textures=this.textures
	var nodesize=this.nodesize
	var outernodes=this.outernodes
	var k = 0, i, j
	var fullsize=gridsize*nodesize
	for (var i =0;i<fullsize;i+=nodesize)
		for (var j =0;j<fullsize;j+=nodesize){
			textures[grid[k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize})
			k++;
		}
	k=0;
	var currsize=-(gridsize/2+gridsize%2+1)*nodesize
	for(i=-1*nodesize;i>currsize;i-=nodesize)
		for(j=-i-1*nodesize;j<fullsize-(-i-1);j+=nodesize) {
			textures[outernodes[0][k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=(gridsize/2+gridsize%2+1)*nodesize
	for(j=0;j<currsize;j+=nodesize)
		for(i=j;i<fullsize-j;i+=nodesize) {
			textures[outernodes[1][k].tex_id].draw(this.ctx,i,j+fullsize,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=(gridsize/2+gridsize%2+1)*nodesize
	for(i=0;i<currsize;i+=nodesize)
		for(j=i;j<fullsize-i;j+=nodesize) {
			textures[outernodes[2][k].tex_id].draw(this.ctx,i+fullsize,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=-(gridsize/2+gridsize%2+1)*nodesize
	for(j=-1*nodesize;j>currsize;j-=nodesize)
		for(i=-j-1*nodesize;i<fullsize-(-j-1);i+=nodesize) {
			textures[outernodes[3][k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}		
	
}

Map.prototype.draw= function (c){
//	c.clearRect(0,0,c.canvas.width,c.canvas.height)
	c.drawImage(this.canvas,0,0);
}