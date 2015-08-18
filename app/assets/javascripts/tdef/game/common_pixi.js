//add perv stats on screen
function showStats(place){
	if (!stats)
		return;
	stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb
	// align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = (place.x || place.left) + 'px';
	stats.domElement.style.top = (place.y || place.top) + 'px';
	
	document.body.appendChild( stats.domElement );
}

//objects gragging hack
var dragObj;
function incredibleHack(){
	if (this.children)
		for (var i in this.children)
			incredibleHack.call(this.children[i]);
	if (this.dragging && this!=dragObj)
		this.dragging=false;
}

function startDragging(data) {
	var f=false;
	//hack for dragging objects with dragging parents
	if (!dragObj || dragObj==this.parent){
		dragObj=this;
		f=true;
	}
	if (this.actions.indexOf("drag")>-1 ){
		if (!this.mousePressPoint)
			this.mousePressPoint={};
		this.mousePressPoint.x = data.getLocalPosition(this.parent).x -
				this.position.x;
		this.mousePressPoint.y = data.getLocalPosition(this.parent).y -
				this.position.y;
		//start dragging
		if (dragObj==this)
			this.dragging = true;
	}
	//set point for click check
	if (!this.screenPressPoint)
		this.screenPressPoint={};
	var stage=this.stage || getEngine().stage;
	this.screenPressPoint.x = data.getLocalPosition(stage).x;
	this.screenPressPoint.y = data.getLocalPosition(stage).y;
	if (f)
		incredibleHack.call(this.stage);
}

function stopDragging(data) {
		if (this.actions.indexOf("press")>-1){
			if (!this.screenPressPoint)
				this.screenPressPoint={};
			var screenPressPoint={};
			var engine=getEngine();
			var stage=this.stage || engine.stage;
			screenPressPoint.x = data.getLocalPosition(stage).x;
			screenPressPoint.y = data.getLocalPosition(stage).y;
			if (Math.abs(this.screenPressPoint.x-screenPressPoint.x)<engine.settings.clickAreaSize && 
					Math.abs(this.screenPressPoint.y-screenPressPoint.y)<engine.settings.clickAreaSize){
				if (this.pressAction && (dragObj==this) )
					this.pressAction();
			}
		}
		this.dragging = false;
		dragObj=false;
}

function proceedDragging(data){
	if (this.moveAction)
		this.moveAction(data);
	if(this.dragging){
		var position = data.getLocalPosition(this.parent);
		this.position.x = position.x - this.mousePressPoint.x;
		this.position.y = position.y - this.mousePressPoint.y;
		if (this.transformCorrection)
			this.transformCorrection();
	}
}


//opt={src:"path", height: int, width: int, frames: int}
function getTextureFrames(opt){
	if (!opt.textures){
		opt.textures=[];
		opt.base=new PIXI.BaseTexture.fromImage(opt.src);
		var height=opt.height || opt.base.height;
		var width=opt.width || height;
		var frames=opt.frames || opt.base.width/height || 1;
		//		a[i]=[];
		for(var j=0;j<frames;j++){
			opt.textures.push(new PIXI.Texture(opt.base, new PIXI.Rectangle(width*j, 0, width, height)));
		}
	}
	return opt.textures;
}

function fitDimensions(from, to){ //from -screen to - wallpaper
	var height=from.width/to.width*to.height
	var width=from.height/to.height*to.width
	if (width>=from.width){
		return {width:width,height:from.height};
	}
	if (height>=from.height){
		return {width:from.width,height:height};
	}
	return from;
	
}
//when image loading for a long time
function afterTextureLoad(texture, func){
	if (texture.baseTexture.hasLoaded)
		func();
	else
		texture.addEventListener("update", func);
}

function afterSpriteLoad(sprite, func){
	afterTextureLoad(sprite.texture,func);
}


