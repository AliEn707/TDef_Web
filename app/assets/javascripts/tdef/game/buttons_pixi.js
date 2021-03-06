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
opt		position: { 
			x: int, 
			y: int, 
		}
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
opt	float: {
opt		x: string - 'fixed' or 'float'
opt		y: string - 'fixed' or 'float'
	} 
opt	actions: [] - may containes "press" "drag"
opt	hitArea: {x: int, y: int, width: int, height: int}
opt	innerArea: {x: int, y: int, width: int, height: int} - must be exeist if no sprite attr
opt	fitParent: boolean
opt	position: {
	x: int, 
	y: int,
opt	float: {
opt		x: string - 'fixed' or 'float'
opt		y: string - 'fixed' or 'float'
	} 
}
opt	pressActions: [func]
opt	beforePressActions: [func]
opt	afterPressActions: [func]
opt	beforePressStopActions: [func]
opt	afterPressStopActions: [func]
opt	beforeMoveActions: [func]
opt	afterMoveActions: [func]
opt	beforeMouseOverActions: [func]
opt	afterMouseOverActions: [func]
opt	beforeMouseOutActions: [func]
opt	afterMouseOutActions: [func]
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
		if (opt.focused){ //unfocused only may be if axests focused
			if (opt.focused.textures)
				this.focused=new ASprite(opt.focused.textures,opt.focused.opt || opt.sprite.opt || {});
			else
				this.focused=opt.focused;
			this.addChild(this.focused);
			this.focused.alpha=0.01;
		}
	}
	this.engine=opt.engine || getEngine();
	this.buttons=[];
	if (opt.hitArea)
		this.hitArea=new PIXI.Rectangle(opt.hitArea.x,opt.hitArea.y,opt.hitArea.width,opt.hitArea.height);
	if (opt.position){
		this.position.x=opt.position.x;
		this.position.y=opt.position.y;
		if (opt.position.float){	
			f={}
			if (opt.position.float.x=='fixed')
				f.x={fixed: (this.engine.renderer.width - this.position.x) || 1};
			else if (opt.position.float.x=='float')
				f.x={float: this.position.x/this.engine.renderer.width};					
			if (opt.position.float.y=='fixed')
				f.y={fixed: (this.engine.renderer.height - this.position.y) || 1};	
			else if (opt.position.float.y=='float')
				f.y={float: this.position.y/this.engine.renderer.height};	
			if (f.x || f.y)
				this.position.float=f;
		}
	}
	if (opt.float){
		f={}
		if (opt.float.x=='fixed')
			f.x={fixed: this.engine.renderer.width-(this.realWidth || this.width) || 1};
		else if (opt.float.x=='float')
			f.x={float: (this.realWidth || this.width)/this.engine.renderer.width};
		if (opt.float.y=='fixed')
			f.y={fixed: this.engine.renderer.height-(this.realHeight || this.height) || 1};
		else if (opt.float.y=='float')
			f.y={float: (this.realHeight || this.height)/this.engine.renderer.height};
		if (f.x || f.y)
			this.float=f;
	}
	this.args=opt.args;
	this.actions=opt.actions;
	if (this.actions){
		this.interactive=true;
		this.mousedown = this.touchstart = startDragging;
		this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = stopDragging;
		if (this.actions.indexOf("drag")>-1)
			this.mousemove = this.touchmove = proceedDragging;
		if (this.actions.indexOf("press")>-1){
			this.pressActions=opt.pressActions || [];
		}
	}
	//set actions
	actions=['beforePressActions', 'afterPressActions',	'beforePressStopActions',	'afterPressStopActions',	'beforeMoveActions',	'afterMoveActions',	'beforeMouseOverActions',	'afterMouseOverActions',	'beforeMouseOutActions',	'afterMouseOutActions'];
	for (var i in actions)
		this[actions[i]]=opt[actions[i]] || [];

	this.depth=-1;//allways on screen
	if (this.unfocused)
		this.innerArea=opt.innerArea || {x:0,y:0,width:this.unfocused.getAttr("width"),height:this.unfocused.getAttr("height")};
	this.fitParent=opt.fitParent;
	this.innerArea=this.innerArea || {};
		
	if (opt.text){
		this.text=new PIXI.Text(opt.text.data.translate,opt.text.style)
		if (opt.text.position)
			this.text.position=opt.text.position;
		if (opt.text.anchor)
			this.text.anchor=opt.text.anchor;
		this.addChild(this.text);
	}
}

ButtonContainer.prototype= new PIXI.DisplayObjectContainer();
ButtonContainer.prototype.constructor=ButtonContainer;

ButtonContainer.prototype.mouseover=function(){
	if (this.disable)
		return;
	if (this.beforeMouseOverActions)
		for (var i in this.beforeMouseOverActions)
			this.beforeMouseOveractions[i].call(this);
	if (this.focused){
		this.focused.alpha=1;
		this.unfocused.alpha=0.01;
	}
	if (this.afterMouseOverActions)
		for (var i in this.afterMouseOverActions)
			this.afterMouseOverActions[i].call(this);
}
	
ButtonContainer.prototype.mouseout=function(){
	if (this.disable)
		return;
	for (var i in this.beforeMouseOutActions)
		this.beforeMouseOutActions[i].call();
	if (this.focused){
		this.unfocused.alpha=1;
		this.focused.alpha=0.01;
	}
	for (var i in this.afterMouseOutActions)
		this.afterMouseOutActions[i].call();
}
/*
{
  opt the same as on button
  add:{
    hideable: boolean
    show_by_default: boolean
  }
}
*/
ButtonContainer.prototype.addButton=function (opt, add){
  add=add || {};
	var button=new ButtonContainer(opt);
	this.buttons.push(button);
	this.addChild(button);
  if (add.hideable){
    this.interactive=true;
    button.visible=false;
    if (add.show_by_default)
      button.visible=true;
    console.log(add)
    this.beforeMouseOver= this.beforeMouseOut= function (){
			if (!this.disable)
				button.visible= (button.visible==false);
    }
  }
	return button;
}

ButtonContainer.prototype.setWidthHeight=function (){
	if (this.$width){
		if (!this.unfocused || (this.unfocused && this.unfocused.hasLoaded())){
			this.width=this.$width;
			if (this.float && this.float.x){ //need to check
				if (this.float.x.float)
					this.float.x.float=this.$width/this.engine.renderer.width;
				else	if (this.float.x.fixed)
					this.float.x.fixed=this.engine.renderer.width-this.$width || 1;
			}
			delete this.$width;
		}
	}
	if (this.$height){
		if (!this.unfocused || (this.unfocused && this.unfocused.hasLoaded())){
			this.height=this.$height;
			if (this.float&& this.float.y){
				if (this.float.y.float)
					this.float.y.float=this.$height/this.engine.renderer.height;
				else if (this.float.y.fixed)
					this.float.y.fixed=this.engine.renderer.height-this.$height || 1;
			}
			delete this.$height;
		}
	}
}

ButtonContainer.prototype.resize=function (width,height){
	if (this.float){
		if (this.float.x)
			if (this.float.x.float)
				this.width=width*this.float.x.float;
			else if (this.float.x.fixed)
				this.width=width-this.float.x.fixed;
		if (this.float.y)
			if (this.float.y.float)
				this.height=height*this.float.y.float;
			else if (this.float.y.fixed)
				this.height=height-this.float.y.fixed;
	}	
	if (this.position.float){
		if (this.position.float.x)
			if (this.position.float.x.float)
				this.position.x=width*this.position.float.x.float;
			else if (this.position.float.x.fixed)
				this.position.x=width-this.position.float.x.fixed;
		if (this.position.float.y)
			if (this.position.float.y.float)
				this.position.y=height*this.position.float.y.float;
			else if (this.position.float.y.fixed)
				this.position.y=height-this.position.float.y.fixed;
	}
	if (this.parent.scroller && this.parent.scroller.area && this.parent.scroller.area.float){
		if (this.parent.scroller.area.float.width)
			if (this.parent.scroller.area.float.width.float)
				this.parent.scroller.area.width=width*this.parent.scroller.area.float.width.float;
			else if (this.parent.scroller.area.float.width.fixed)
				this.parent.scroller.area.width=width-this.parent.scroller.area.float.width.fixed;				
		if (this.parent.scroller.area.float.height)
			if (this.parent.scroller.area.float.height.float)
				this.parent.scroller.area.height=height*this.parent.scroller.area.float.height.float;
			else if (this.parent.scroller.area.float.height.fixed)
				this.parent.scroller.area.height=height-this.parent.scroller.area.float.height.fixed;
		if (this.parent.scroller.area.float.x)
			if (this.parent.scroller.area.float.x.float)
				this.parent.scroller.area.x=width*this.parent.scroller.area.float.x.float;
			else if (this.parent.scroller.area.float.x.fixed)
				this.parent.scroller.area.x=width-this.parent.scroller.area.float.x.fixed;
		if (this.parent.scroller.area.float.y)
			if (this.parent.scroller.area.float.y.float)
				this.parent.scroller.area.y=height*this.parent.scroller.area.float.y.float;
			else if (this.parent.scroller.area.float.y.fixed)
				this.parent.scroller.area.y=height-this.parent.scroller.area.float.y.fixed;
		if (this.scrolling){
			this.scrolling.mask.clear();
			this.scrolling.mask.beginFill(0x8bc5ff, 0.4);
			this.scrolling.mask.drawRect(this.parent.scroller.area.x,
									this.parent.scroller.area.y,
									this.parent.scroller.area.width,
									this.parent.scroller.area.height);
			this.scrolling.mask.endFill();
		}
	}
	for (var i in this.children)
		if (this.children[i].resize)
			this.children[i].resize(width,height);
}

ButtonContainer.prototype.proceed=function (){
	//check size of button
	this.setWidthHeight();
/*	//change frame for background
	if (this.unfocused){
		if (this.unfocused.alpha==1)
			this.unfocused.upFrame();
		else	if (this.focused && this.focused.alpha==1)
			this.focused.upFrame();
	}
*/
	//and for all buttons
	for(var i in this.children){
		if (this.children[i].proceed)
			this.children[i].proceed();
	}
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
	var t=this.focused || this.unfocused;
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
	var t=this.focused || this.unfocused;
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

Object.defineProperty(ButtonContainer.prototype, 'realWidth', {
    get: function() {
	if (this.children.lenght==0)
	    return;
	var t=this.getChildAt(0)
	if (t)
		return  t.realWidth;
    },
    set: function(value) {
	
    }
});

Object.defineProperty(ButtonContainer.prototype, 'realHeight', {
    get: function() {
	if (this.children.lenght==0)
	    return;
	var t=this.getChildAt(0)
	if (t)
		return  t.realHeight;
    },
    set: function(value) {
	    
    }
});

Object.defineProperty(ButtonContainer.prototype, 'disable', {
	get: function() {
		return this._$disable && this._$disable.visible;
	},
	set: function(value) {
		var that=this;
		if (!that._$disable){
			that._$disable=new PIXI.Graphics();
			that.addChild(that._$disable);
			(that.resize=function (){
				that._$disable.clear();
				that._$disable.beginFill(0x000000, 0.63);
				that._$disable.drawRect(0, 0, that.width, that.height);
				that._$disable.endFill();
			})();
		}
		if (value!=this.disable){
				this._$disable.visible=true;
		}
	}
});

//hide part of button, outside from params
//from - position on pixels
//per size in percents
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
opt  rows: int - not used in circle
opt  columns: int - for circle number of items
  buttonSize: {x: int, y: int}
  buttonDist: {x: int, y: int} - for circle x is radius
opt circle:{
    center: int - center of circle, 0 in the top, go like a clock
    centered: boolean - set buttons over the entire circumference, or relative to the point
  }
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
  this.buttonDist=obj.buttonDist || {x: 0, y: 0};
  this.circle=obj.circle;
  if (this.circle){
    this.circle.center=this.circle.center || 0; //bottom point
  }else{
    //scroller init if not circle
    this.keyPadScrollerInit(obj.scrolling);
  }
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
    button.fitParent=true;
    //some kind of hack
    button.width=button.$width=this.buttonSize.x; 
    button.height=button.$height=this.buttonSize.y;
    button.actions=button.actions || [];
    if (button.actions.indexOf("drag")>-1)
      delete button.actions[button.actions.indexOf("drag")];
    this.keypad[pos]=button;
    if (pos> this.rows*this.columns)
      console.log("Button position "+pos+" out of keypad");
    if (this.circle){
      //update all buttons
      for (var i in this.keypad)
        this.keypad[i].position=this.keyPadButtonPosition(i);
    }else{
      button.position= this.keyPadButtonPosition(pos);
      if (this.scrolling){
        button.actions.push("drag");
        button.interactive=true;
        button.mask=this.scrolling.mask;
        button.hitArea={x:0,y:0,width:this.buttonSize.x,height:this.buttonSize.y};
        button.mousemove = button.touchmove = function (data){
          this.parent.dragging=this.dragging
          this.parent.mousemove(data);
          this.parent.dragging=false;
        };
        var that=this;
        button.mouseweel = this.scrollingWeel;
        button.mousedown = button.touchstart = startDragging;
        button.mouseup = button.mouseupoutside = button.touchend = button.touchendoutside = stopDragging;
        button.beforePressActions.push(function(data){ this.parent.mousedown(data) })
        //set area of all buttons
        if (this.scrolling.area.width<button.position.x){
          this.scrolling.area.width=button.position.x;
          if (this.hitArea)
            this.hitArea.width+=this.buttonSize.x+this.buttonDist.x;
        }
        if (this.scrolling.area.height<button.position.y){
          this.scrolling.area.height=button.position.y;
          if (this.hitArea)
            this.hitArea.height+=this.buttonSize.y+this.buttonDist.y;
        }
      }
    }
	}
	return button;
}

ButtonContainer.prototype.keyPadButtonPosition=function (pos){
  if (this.circle){
    //get angle of button on circle
    var angle=this.circle.center-Math.PI/2+(this.circle.centered ? (pos-(this.keypad.length-1)/2)*Math.PI*2/this.columns : pos*Math.PI*2/this.keypad.length);
    return {
      x: Math.cos(angle)*this.buttonDist.x-this.buttonSize.x/2,
      y: Math.sin(angle)*this.buttonDist.x-this.buttonSize.y/2
    };
  }else{
    return {
      y: (this.innerArea.y || 0)+this.buttonDist.y+parseInt(pos/this.columns)*(this.buttonSize.y+this.buttonDist.y),
      x: (this.innerArea.x || 0)+this.buttonDist.x+parseInt(pos%this.columns)*(this.buttonSize.x+this.buttonDist.x) 
    };
  }
}

ButtonContainer.prototype.keyPadGetButton=function (pos){
	return this.keypad[pos];
}

ButtonContainer.prototype.keyPadRemoveButton=function (obj){
	this.keyPadRemoveButtonByIndex(this.keypad.indexOf(obj));
}

ButtonContainer.prototype.keyPadRemoveButtonByIndex=function (pos){
	//TODO: add type check
	if (pos<0)
		return;
	var button=this.keypad[pos];
	delete this.buttons.splice(this.buttons.indexOf(button),1);
	delete button;
	delete this.keypad.splice(pos,1);
	for(var i=pos;i<this.keypad.length;i+=1){
		var position=this.keyPadButtonPosition(i);
		this.keypad[i].position.y=position.y; 
		this.keypad[i].position.x=position.x; 
	}
	//TODO: check
	if (this.scrolling.area.width>this.keypad[this.keypad.length-1].x){
		this.scrolling.area.width=this.keypad[this.keypad.length-1].x;
		if (this.hitArea)
			this.hitArea.width-=this.buttonSize.x+this.buttonDist.x;
	}
	if (this.scrolling.area.height>this.keypad[this.keypad.length-1].y){
		this.scrolling.area.height=this.keypad[this.keypad.length-1].y;
		if (this.hitArea)
			this.hitArea.height-=this.buttonSize.y+this.buttonDist.y;
	}
}

ButtonContainer.prototype.keyPadScrollerInit=function (scroll){
	if (!scroll)
		return;
	scroll.type=scroll.type || "v"; //default
	this.scrolling={
		area: {
			x: this.buttonDist.x+this.buttonSize.x, 
			y: this.buttonDist.y+this.buttonSize.y, 
			width: this.buttonDist.x,
			height: this.buttonDist.y,
		}
	};
	this.interactive=true;
	
	this.removeChild(this.focused)
	delete this.focused
	this.removeChild(this.unfocused)
	delete this.unfocused
	
	this.scrolling.position={}; //for position correction on non scroll axis
	this.scrollingPosition(this.position);
	if ("vertical".indexOf(scroll.type)==0)
		this.scrolling.dir="x";
	else
		this.scrolling.dir="y";

	this.afterMoveActions.push(this.scrollingAction);
	this.mouseweel = this.scrollingWeel;
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
			f={}
			if (this.float){
				if (this.float.x)
					if (this.float.x.float)
						f.width= {float: this.parent.scroller.area.width/this.engine.renderer.width};
					else
						f.width= {fixed: this.engine.renderer.width-this.parent.scroller.area.width || 1};
				if (this.float.y)
					if (this.float.y.float)
						f.height= {float: this.parent.scroller.area.height/this.engine.renderer.height};
					else
						f.height= {fixed: this.engine.renderer.height-this.parent.scroller.area.height || 1};
			}
			if (this.position.float){
				if (this.position.float.x.float)
					f.x= {float: this.parent.scroller.area.x/this.engine.renderer.width};
				else 
					f.x= {fixed: this.engine.renderer.width-this.parent.scroller.area.x || 1};
				if (this.position.float.y.float)
					f.y= {float: this.parent.scroller.area.y/this.engine.renderer.height};
				else
					f.y= {fixed: this.engine.renderer.height-this.parent.scroller.area.y || 1};
			}
			if (f.x || f.y || f.width || f.height)
				this.parent.scroller.area.float=f;
		}
	}
}

ButtonContainer.prototype.scrollingPosition=function (pos){
	this.scrolling.position.x=pos.x;
	this.scrolling.position.y=pos.y;			
}

//aftermove for crolling container, fix not moving direction
ButtonContainer.prototype.scrollingAction=function (data){
	this.position[this.scrolling.dir]=this.scrolling.position[this.scrolling.dir];
	this.scrollingCorrection();
	this.scrollingPosition(this.position);
}

ButtonContainer.prototype.scrollingCorrection=function (data){
	var dir=this.scrolling.dir == 'x' ? 'y' : 'x';
	var size=this.scrolling.dir == 'x' ? 'height' : 'width';
	var that=this.parent;
	var shift;
	if (this.scrolling.area[size]+this.buttonSize[dir]<that.scroller.area[size]){
		this.position[dir]=that.scroller.area[dir];//cancel moving
	}else{
		//bottom check
		if ((shift=(this.position[dir]+this.scrolling.area[size]+this.buttonSize[dir]+this.buttonDist[dir]-(that.scroller.area[dir]+that.scroller.area[size])))<0)
			this.position[dir]-=shift;//TODO: add kinetics restore
		console.log(shift);
		//top check
		if ((shift=(this.position[dir]-that.scroller.area[dir]))>0)
			this.position[dir]-=shift;
	}
}

//action for button from crolling container
ButtonContainer.prototype.scrollingWeel=function (m){
	var e=m.originalEvent;
	var engine=this.engine;
	var that=this;
	if (!this.scrolling)
		that=this.parent;
	e = e || window.event;
	if (e.type=="wheel" || e.type=="mousewheel"){
		var delta = e.deltaY || e.detail || e.wheelDelta;
		that.position[({x:'y',y:'x'})[that.scrolling.dir]]+=engine.settings.scrollSpeed*(delta>0 ? -1 : 1)*engine.settings.weelInverted;
	}
	that.scrollingCorrection();
}

