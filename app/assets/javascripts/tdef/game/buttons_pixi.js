function ButtonContainer(opt){
	PIXI.DisplayObjectContainer.call(this);
	this.unfocused=new ASprite(opt.sprite.textures,opt.sprite.opt);
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

	this.pressAction=opt.pressAction;
	this.innerArea=opt.innerArea || {x:0,y:0,width:this.unfocused.getAttr("width"),height:this.unfocused.getAttr("height")};
	
	this.addChild(this.unfocused);
}

ButtonContainer.prototype= new PIXI.DisplayObjectContainer();
ButtonContainer.prototype.constructor=ButtonContainer;

ButtonContainer.prototype.addButton=function (opt){
	var button=new ButtonContainer(opt);
	this.buttons.push(button);
	this.addChild(button);
}

ButtonContainer.prototype.proceed=function (){
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
