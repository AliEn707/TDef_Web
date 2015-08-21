/*
opt: {
opt	sprite: {
!		textures: [] - textures for common sprite
!		opt: {}
	} || ASprite || ATilingSprite
opt	focused: {
!		textures: [] - textures for common sprite
!		opt: {}
	} || ASprite || ATilingSprite
opt	text:{
opt		position: { x: int, y: int }
opt		anchor: { x: int, y: int }
		data : string
opt		style: {
opt			font: strint - 'bold 20px Arial'
opt			fill: string - "#000000"
opt			stroke: string - "#000000"
opt			strokeThickness: int
opt			wordWrap: boolean
opt			wordWrapWidth: int
opt			dropShadow: boolean
opt			dropShadowColor: string - '#000000'
opt			dropShadowAngle: number
opt			dropShadowDistance: int
		} PIXI text style
	}
opt	actions: [] - may containes "press" "drag"
opt	hitArea: {x: int, y: int, width: int, height: int}
opt	innerArea: {x: int, y: int, width: int, height: int} - must be exeist if no sprite attr
opt	fitParent: boolean
opt	position: {x: int, y: int}
opt	pressAction: func
opt	overAction: func
opt	outerAction: func
opt	args: obj - some arguments that can be used in functions
}
*/

function ButtonContainer(opt){
	PIXI.DisplayObjectContainer.call(this);
	if (opt.sprite){
		if (opt.sprite.textures)
			this.unfocused=new ASprite(opt.sprite.textures,opt.sprite.opt || {});
		else
			this.unfocused=opt.sprite;
		this.addChild(this.unfocused);
	}
	this.engine=getEngine();
	this.buttons=[];
	if (opt.hitArea)
		this.hitArea=new PIXI.Rectangle(opt.hitArea.x,opt.hitArea.y,opt.hitArea.width,opt.hitArea.height);
	if (opt.position){
		this.position.x=opt.position.x;
		this.position.y=opt.position.y;
	}
	this.args=opt.args;
	this.actions=opt.actions;
	if (this.actions)
		this.interactive=true;
	if (this.actions){
		this.mousedown = this.touchstart = startDragging;
		this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = stopDragging;
		if (this.actions.indexOf("drag")>-1)
			this.mousemove = this.touchmove = proceedDragging;
		if (this.actions.indexOf("press")>-1)
			this.pressAction=opt.pressAction;
	}
	if (this.unfocused && opt.focused){ //unfocused only may be if axests focused
		if (opt.focused.textures)
			this.focused=new ASprite(opt.focused.textures,opt.focused.opt || opt.sprite.opt || {});
		else
			this.focused=opt.focused;
	}
	if (opt.overAction)
		this.overAction=opt.overAction;
	if (opt.outerAction)
		this.outerAction=opt.outerAction;
	
	this.mouseover=function(){
		if (this.focused){
			this.removeChild(this.unfocused);
			this.addChildAt(this.focused,0);
		}
		if (this.overAction)
			this.overAction();
	}
	this.mouseout=function(){
		if (this.focused){
			this.removeChild(this.focused);
			this.addChildAt(this.unfocused,0);
		}
		if (this.outerAction)
			this.outerAction();
	}
	this.depth=0;//allways on screen
	if (this.unfocused)
		this.innerArea=opt.innerArea || {x:0,y:0,width:this.unfocused.getAttr("width"),height:this.unfocused.getAttr("height")};
	this.fitParent=opt.fitParent;
	this.innerArea=this.innerArea || {};
		
	if (opt.text){
		this.text=new PIXI.Text(opt.text.data,opt.text.style)
		if (opt.text.position)
			this.text.position=opt.text.position;
		if (opt.text.anchor)
			this.text.anchor=opt.text.anchor;
		this.addChild(this.text);
	}
}

ButtonContainer.prototype= new PIXI.DisplayObjectContainer();
ButtonContainer.prototype.constructor=ButtonContainer;

ButtonContainer.prototype.addButton=function (opt){
	var button=new ButtonContainer(opt);
	this.buttons.push(button);
	this.addChild(button);
	return button;
}

ButtonContainer.prototype.setWidthHeight=function (){
	if (this.$width){
		if (this.getChildAt(0).hasLoaded()){
			this.width=this.$width;
			delete this.$width;
		}
	}
	if (this.$height){
		if (this.getChildAt(0).hasLoaded()){
			this.height=this.$height;
			delete this.$height;
		}
	}
}

ButtonContainer.prototype.proceed=function (){
	//check size of button
	this.setWidthHeight();
	//change frame for background
	var t=this.getChildAt(0);
	if (t && t.upFrame)
		t.upFrame();
	//and for all buttons
	for(var i in this.buttons)
		if (this.buttons[i].proceed)
			this.buttons[i].proceed();
}

ButtonContainer.prototype.transformCorrection=function (){
	if (this.fitParent && this.parent.innerArea){
		if (this.position.x<this.parent.innerArea.x)
			this.position.x+=this.parent.innerArea.x-this.position.x;
		if (this.position.y<this.parent.innerArea.y)
			this.position.y+=this.parent.innerArea.y-this.position.y;
		if (this.position.y+this.height>this.parent.innerArea.y+this.parent.innerArea.height)
			this.position.y-=(this.position.y+this.height)-(this.parent.innerArea.y+this.parent.innerArea.height);
		if (this.position.x+this.width>this.parent.innerArea.x+this.parent.innerArea.width)
			this.position.x-=(this.position.x+this.width)-(this.parent.innerArea.x+this.parent.innerArea.width);
	}
}

Object.defineProperty(ButtonContainer.prototype, 'height', {
    get: function() {
	var t=this.getChildAt(0)
	if (t)
		return  t.height;
    },
    set: function(value) {
	if (this.unfocused)
		this.unfocused.height = value;
	if (this.focused)
	    this.focused.height = value;
    }
});

Object.defineProperty(ButtonContainer.prototype, 'width', {
    get: function() {
	var t=this.getChildAt(0)
	if (t)
		return  t.width;
    },
    set: function(value) {
	if (this.unfocused)
		this.unfocused.width = value;
	if (this.focused)
	    this.focused.width = value;
    }
});

//hide part of button, outside from params
ButtonContainer.prototype.hidePart=function (from,per){
	if (!this.mask){
		this.mask=new PIXI.Graphics();
		this.addChild(this.mask);
	}
	if (!this._masking)
		this._masking={};
	//hack like caching
	if (this._masking.from==from && this._masking.per==per)
		return;
	if (per<0.01) 
		per=0.01;
	var o=this.getChildAt(0)
	var obj={};
	var height=this.$height || this.height;
	var width=this.$width || this.width;
	if (from=='left'){
		obj.y=0;
		obj.height=height;
		obj.x=0;
		obj.width=width*per;
	}
	if (from=='right'){
		obj.y=0;
		obj.height=height;
		obj.x=width*(1-per);
		obj.width=width*per;
	}
	if (from=='top'){
		obj.y=0;
		obj.height=height*(per);
		obj.x=0;
		obj.width=width;
	}
	if (from=='bottom'){
		obj.y=height*(1-per);
		obj.height=height*(per);
		obj.x=0;
		obj.width=width;
	}
	this.mask.clear();
	this.mask.beginFill(0x8bc5ff, 0.4);
	this.mask.drawRect(obj.x,obj.y,obj.width,obj.height);
	this.mask.endFill();
	this._masking.from=from; 
	this._masking.per=per;
}

//keypad container with rows and cols of buttons
/*
{
	rows: int
	columns: int
	buttonSize: {x: int, y: int}
	buttonDist: int
opt	scrolling:{
		type: "vertical" || "horisontal" (may be n first chars) [vertical]
		area: {x: int, y: int, width: int, height: int}
	}
}
*/
ButtonContainer.prototype.keyPadInit=function (obj){
	obj=obj || {};
	this.fitParent=true;
	this.keypad=[];
	this.rows=obj.rows || 1;
	this.columns=obj.columns || 1;
	this.buttonSize=obj.buttonSize || {x: this.unfocused.getAttr("width")/this.columns,y: this.unfocused.getAttr("height")/this.rows};
	this.buttonDist=obj.buttonDist || 5;
	this.keyPadScrollerInit(obj.scrolling);
}
/*
	rows
cols	123
	456
*/
ButtonContainer.prototype.keyPadAddButton=function (opt,pos){
	var button = this.addButton(opt);
	if (this.keypad){
		pos=pos || this.keypad.length;
		this.keypad[pos]=button;
		if (pos> this.rows*this.columns)
			console.log("Button position "+pos+" out of keypad");
		button.position={
			y: (this.innerArea.y || 0)+this.buttonDist+parseInt(pos/this.columns)*(this.buttonSize.x+this.buttonDist),
			x: (this.innerArea.x || 0)+this.buttonDist+parseInt(pos%this.columns)*(this.buttonSize.y+this.buttonDist) 
		};
		button.fitParent=true;
		//some kind of hack
		button.$width=this.buttonSize.x; 
		button.$height=this.buttonSize.y;
		if (button.actions.indexOf("drag")>-1)
			delete button.actions[button.actions.indexOf("drag")];
		if (this.scrolling){
			button.actions.push("drag");
			button.interactive=true;
			button.mask=this.scrolling.mask;
			button.mousemove = button.touchmove = function (data){
				this.parent.dragging=this.dragging
				this.parent.mousemove(data);
				this.parent.dragging=false;
			};
			var that=this;
			button.mouseweel = this.scrollingWeel;
			button.mousedown = button.touchstart = startDragging;
			button.mouseup = button.mouseupoutside = button.touchend = button.touchendoutside = stopDragging;
			button.beforePressAction=function(data){ this.parent.mousedown(data) }
			//set area of all buttons
			if (this.scrolling.area.width<button.position.x)
				this.scrolling.area.width=button.position.x;
			if (this.scrolling.area.height<button.position.y)
				this.scrolling.area.height=button.position.y;
		}
	}
	
	return button;
}

ButtonContainer.prototype.keyPadGetButton=function (pos){
	return this.keypad[pos];
}

ButtonContainer.prototype.keyPadScrollerInit=function (scroll){
	if (!scroll)
		return;
	scroll.type=scroll.type || "v"; //default
	this.scrolling={
		area: {
			x: this.buttonDist+this.buttonSize.x, 
			y: this.buttonDist+this.buttonSize.y, 
			width: this.buttonDist,
			height: this.buttonDist,
		}
	};
	this.interactive=true;
	
	this.removeChild(this.focused)
	delete this.focused
	this.removeChild(this.unfocused)
	delete this.unfocused
	
	this.scrolling.position={}; //for position correction on non scroll axis
	this.scrollingPosition(this.position);
	if ("vertical".indexOf(scroll.type)==0){
		this.scrolling.dir="x";
	}else{
		this.scrolling.dir="y";
	}
	this.afterMoveAction=this.scrollingAction;
	
	if (this.parent){
		this.parent.scroller={};
		this.parent.scroller.area=scroll.area || clone(this.parent.innerArea);
		if (this.parent.scroller.area){
			this.parent.scroller.area.x+=this.position.x;
			this.parent.scroller.area.y+=this.position.y;
			this.scrolling.mask=new PIXI.Graphics();
			this.parent.addChild(this.scrolling.mask); //don't foget to remove
			this.scrolling.mask.isMask=true;
			this.scrolling.mask.clear();
			this.scrolling.mask.beginFill(0x8bc5ff, 0.4);
			this.scrolling.mask.drawRect(this.parent.scroller.area.x,
									this.parent.scroller.area.y,
									this.parent.scroller.area.width,
									this.parent.scroller.area.height);
			this.scrolling.mask.endFill();
		}
	}
}

ButtonContainer.prototype.scrollingPosition=function (pos){
	this.scrolling.position.x=pos.x;
	this.scrolling.position.y=pos.y;			
}

//aftermove for crolling container
ButtonContainer.prototype.scrollingAction=function (data){
	this.position[this.scrolling.dir]=this.scrolling.position[this.scrolling.dir];
	this.scrollingPosition(this.position);
	this.scrollingCorrection()
}
ButtonContainer.prototype.scrollingCorrection=function (data){
	var dir=this.scrolling.dir == 'x' ? 'y' : 'x';
	var size=this.scrolling.dir == 'x' ? 'height' : 'width';
	var that=this.parent;
	var shift;
	//bottom check
	if ((shift=(this.position[dir]+(this.scrolling.area[dir]-that.scroller.area[dir])-that.scroller.area[size]))>0)
		this.position[dir]-=shift;//TODO: add kinetics restore
	//top check
	if ((shift=(that.scroller.area[dir]-(this.position[dir]+(this.scrolling.area[size]))))>0)
		this.position[dir]+=shift;
}
//action for button from crolling container
ButtonContainer.prototype.scrollingWeel=function (m){
	var e=m.originalEvent;
	var engine=this.engine;
	var that=this.parent
	e = e || window.event;
	if (e.type=="wheel" || e.type=="mousewheel"){
		var delta = e.deltaY || e.detail || e.wheelDelta;
		that.position[({x:'y',y:'x'})[that.scrolling.dir]]+=engine.settings.scrollSpeed*(delta>0 ? -1 : 1)*engine.settings.weelInverted;
	}
	this.parent.scrollingCorrection();
}

