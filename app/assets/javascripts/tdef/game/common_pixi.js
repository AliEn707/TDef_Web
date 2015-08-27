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

function clone(obj){
	if (obj)
		return JSON.parse(JSON.stringify(obj))
}

function healthColor(p){
	var a={
		red:255*(1-p),
		green:255*p,
		blue:0
	}
	for (var i in a)
		if((a[i]=a[i].toString(16)).length<2){
			a[i]='0'+a[i];
		}
	return parseInt(a.red+a.green+a.blue,16);
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
	if (this.beforePressAction)
		this.beforePressAction(data);
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
	if (this.afterPressAction)
		this.afterPressAction(data);
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
	if (this.beforeMoveAction)
		this.beforeMoveAction(data);
	if(this.dragging){
		var position = data.getLocalPosition(this.parent);
		this.position.x = position.x - this.mousePressPoint.x;
		this.position.y = position.y - this.mousePressPoint.y;
		if (this.transformCorrection)
			this.transformCorrection();
	}
	if (this.afterMoveAction)
		this.afterMoveAction(data);

}

function realPosition(obj){
	if (!obj.parent || obj.parent==obj.stage){
		return {x: obj.position.x, y: obj.position.y, scale: obj.scale.x || 1};
	}else{
		var pos=realPosition(obj.parent)
		return {x: pos.x+obj.position.x, y: pos.y+obj.position.y, scale: pos.scale*obj.scale.x}
	}
}

//find object under cursor
var lastObj;
function findCurObject(obj, pos){
	if (obj.interactive && obj.visible && obj.mouseweel){
		var real=realPosition(obj);
		var area=clone(obj.hitArea || obj.innerArea) || {x:0, y:0, width:obj.width, height:obj.height};
		area.x=(area.x+real.x);
		area.y=(area.y+real.y);
		area.width*=real.scale;
		area.height*=real.scale;
		if (area.x<pos.x && area.y<pos.y && 
			area.x+area.width>pos.x && area.y+area.height>pos.y){
				lastObj=obj;
		}
	}
	for (var i in obj.children) {
		findCurObject(obj.children[i],pos);
	}
}

function weelHandler(data){
	var pos={x: data.layerX || data.clientX, y: data.layerY || data.clientY};
	lastObj=false;
	findCurObject(getEngine().stage, pos);
	if (lastObj)
		lastObj.mouseweel({originalEvent: data});
}

//opt={src:"path", height: int, width: int, frames: int}
function getTextureFrames(opt){
	if (!opt.textures){
		opt.textures=[];
		if (!opt.base)
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

function afterASpriteLoad(sprite, func){
	afterTextureLoad(sprite.frames[sprite.current_frame].texture,func);
}



