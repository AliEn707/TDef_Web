function TDefEngine(place){
	place=place || document.body
	var width=place.offsetWidth || window.innerWidth
	var height=window.innerHeight - 5 - (place.offsetTop || 0)
	console.log(place.innerWidth, height)
	this.stage = new PIXI.Stage(0x000000);
	// create a renderer instance
	this.renderer = new PIXI.CanvasRenderer(width, height)//PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);//WebGLRenderer(400, 300);//
	// add the renderer view element to the DOM
	place.appendChild(this.renderer.view);
	requestAnimFrame( this.render );
	window.engine=this
	this.settings={
			moveSpeed: 4.1, 
			zoomSpeed: 0.1,
			xInverted:1, 
			yInverted:-1, 
			weelInverted: -1,
			mouseMove: true,
			defines:{
				keys:{
					mapMoveLeft:65, /*a*/
					mapMoveRight:68,/*d*/
					mapMoveUp:87,/*w*/
					mapMoveDown:83,/*s*/
					mapZoomUp:90,/*z*/
					mapZoomDown:88/*x*/
				}
			}
		}
}


TDefEngine.prototype.render= function (){
	var that=window.engine
	requestAnimFrame( that.render );

	    // just for fun, lets rotate mr rabbit a little
//	    bunny.rotation += 0.1;
	//a.nextFrame()
	    // render the stage
	    that.renderer.render(that.stage);
	//bunny.nextFrame()
}

TDefEngine.prototype.resize=function (x,y){
	this.renderer.resize(x,y)
}

TDefEngine.prototype.outerSize= function (size){
	return Math.floor((1+(size+1)%2+size)/2)*(Math.floor(size/2)+size%2)
}

TDefEngine.prototype.setMap= function (opt){
	var map=new Grid(opt.size)
	var fullsize=opt.size*opt.size
	var size=map.size
	for(var i=0;i<fullsize;i++)
		map.setNode(i,opt.textures[opt.nodes[i]])
	var k = 0, i, j
		for(i=-1;i>-(size/2+size%2+1);i--)
			for(j=-i-1;j<size-(-i-1);j++) {
				map.setOuterNode(0, k, opt.textures[opt.outerNodes[0][k]], i-1, j)
				k++;
			}
		k=0;
		for(j=0;j<(size/2+size%2+1);j++)
			for(i=j;i<size-j;i++) {
				map.setOuterNode(1, k, opt.textures[opt.outerNodes[1][k]], i, size + j)
				k++;
			}
		k=0;
		for(i=0;i<(size/2+size%2+1);i++)
			for(j=i;j<size-i;j++) {
				map.setOuterNode(2, k, opt.textures[opt.outerNodes[2][k]], size + i, j)
				k++;
			}
		k=0;
		for(j=-1;j>-(size/2+size%2+1);j--)
			for(i=-j-1;i<size-(-j-1);i++) {
				map.setOuterNode(3, k, opt.textures[opt.outerNodes[3][k]], i, j-1)
				k++;
			}
	
	
	this.map=map
	this.stage.addChild(map)
	this.map.transformCorrection()
}


