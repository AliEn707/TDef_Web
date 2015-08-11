function ButtonContainer(opt){
	PIXI.DisplayObjectContainer.call(this);
	
	this.unfocused=new ASprite(opt.sprite.textures,opt.sprite.opt || {});
	this.addChild(this.unfocused);
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
	console.log(this.actions)
	if (this.actions && this.actions.indexOf("drag")>-1){
		this.mousedown = this.touchstart = startDragging;
		this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = stopDragging;
		this.mousemove = this.touchmove = proceedDragging;
	}
	if (opt.focused){
		this.focused=new ASprite(opt.focused.textures,opt.focused.opt||opt.sprite.opt);
		if (opt.overAction)
			this.overAction=opt.overAction;
		if (opt.outerAction)
			this.outerAction=opt.outerAction;
		this.mouseover=function(){
			this.removeChild(this.unfocused);
			this.addChildAt(this.focused,0);
			if (this.overAction)
				this.overAction();
		}
		this.mouseout=function(){
			this.removeChild(this.focused);
			this.addChildAt(this.unfocused,0);
			if (this.outerAction)
				this.outerAction();
		}
	}
	this.depth=0;//allways on screen
	this.pressAction=opt.pressAction;
	this.innerArea=opt.innerArea || {x:0,y:0,width:this.unfocused.getAttr("width"),height:this.unfocused.getAttr("height")};
	
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
	this.getChildAt(0).upFrame();
	//and for all buttons
	for(var i in this.buttons)
		this.buttons[i].proceed();
}


ButtonContainer.prototype.transformCorrection=function (){
	if (this.parent.innerArea){
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

ButtonContainer.prototype.keyPadInit=function (obj){
	obj=obj || {};
	this.keypad={};
	this.rows=obj.rows || 1;
	this.columns=obj.columns || 1;
	this.buttonSize=obj.buttonSize || {x: this.unfocused.getAttr("width")/this.columns,y: this.unfocused.getAttr("height")/this.rows};
	this.buttonDist=obj.buttonDist || 5;
}

ButtonContainer.prototype.keyPadAddButton=function (pos,opt){
	var button = this.addButton(opt);
	if (this.keypad){
		this.keypad[pos]=button;
		if (pos> this.rows*this.columns)
			console.log("Button possition "+pos+" out of keypad");
		var position = {
				y: (this.innerArea.y || 0)+this.buttonDist+parseInt(pos/this.columns)*(this.buttonSize.x+this.buttonDist),
				x: (this.innerArea.x || 0)+this.buttonDist+parseInt((pos%this.columns)/this.rows)*(this.buttonSize.y+this.buttonDist) 
			};
		button.position=position;
		//some kind of hack
		button.$width=this.buttonSize.x; 
		button.$height=this.buttonSize.y;
		if (button.actions.indexOf("drag")>-1)
			delete button.actions[button.actions.indexOf("drag")];
	}
	return button;
}

ButtonContainer.prototype.keyPadGetButton=function (pos){
	return this.keypad[pos];
}

Object.defineProperty(ButtonContainer.prototype, 'height', {
    get: function() {
        return  this.getChildAt(0).height;
    },
    set: function(value) {
       this.getChildAt(0).height = value;
    }
});

Object.defineProperty(ButtonContainer.prototype, 'width', {
    get: function() {
        return  this.getChildAt(0).width;
    },
    set: function(value) {
	this.unfocused.width = value;
	if (this.focused)
	    this.focused.width = value;
    }
});
