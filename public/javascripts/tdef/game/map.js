function Map(obj){
	this.size=obj.size || 1
	this.grid=obj.grid || []
	this.textures= obj.textures || []
	this.nodesize=obj.nodesize || 1
	this.outernodes=obj.outernodes || []
	this.canvas=document.createElement('canvas')
	this.canvas.width=obj.ctx.canvas.width
	this.canvas.height=obj.ctx.canvas.height
	this.ctx=this.canvas.getContext("2d", {alpha: false});
	var scale=1
	this.transform={scale: obj.scale || scale, translate:{x: obj.x || 0,y: obj.y || 0},rotate: -45*Math.PI/180}
//	canvasParent.appendChild(this.canvas)
}

Map.prototype.scale=function (s){
	this.transform.scale*=s || 1
}

Map.prototype.translate=function (p){
	this.transform.translate.x+=p.x || 0
	this.transform.translate.y+=p.y || 0
}

Map.prototype.setCanvasParameters=function (s){
	this.canvas.width=s.width
	this.canvas.height=s.height
	this.update()
}

//update map information 
//use if changes tranformation or window size
Map.prototype.update=function (){
	canvas=this.ctx.canvas
	this.ctx.setTransform( 1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0,0,canvas.width,canvas.height)
	this.ctx.setTransform( this.transform.scale, 0, 0, this.transform.scale*0.5, this.transform.translate.x, this.transform.translate.y);
	this.ctx.rotate(this.transform.rotate);
	grid=this.grid
	gridsize=this.size
	textures=this.textures
	nodesize=this.nodesize
	outernodes=this.outernodes
	var k = 0, i, j
	fullsize=gridsize*nodesize
	for (var i =0;i<fullsize;i+=nodesize)
		for (var j =0;j<fullsize;j+=nodesize){
			textures[grid[k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize})
			k++;
		}
	k=0;
	currsize=-(gridsize/2+gridsize%2+1)*nodesize
	for(i=-1;i>currsize;i-=nodesize)
		for(j=-i-1;j<fullsize-(-i-1);j+=nodesize) {
			textures[outernodes[0][k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=(size/2+size%2+1)*nodesize
	for(j=0;j<currsize;j+=nodesize)
		for(i=j;i<fullsize-j;i+=nodesize) {
			textures[outernodes[1][k].tex_id].draw(this.ctx,i,j+fullsize,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=(size/2+size%2+1)*nodesize
	for(i=0;i<currsize;i+=nodesize)
		for(j=i;j<fullsize-i;j+=nodesize) {
			textures[outernodes[2][k].tex_id].draw(this.ctx,i+fullsize,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}
	k=0;
	currsize=-(size/2+size%2+1)*nodesize
	for(j=-1;j>currsize;j-=nodesize)
		for(i=-j-1;i<fullsize-(-j-1);i+=nodesize) {
			textures[outernodes[3][k].tex_id].draw(this.ctx,i,j,{width:nodesize+1,height:nodesize+1})
			k++;
		}		
	
}

Map.prototype.draw= function (c){
//	c.clearRect(0,0,c.canvas.width,c.canvas.height)
	c.drawImage(this.canvas,0,0);
}