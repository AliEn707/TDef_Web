function Public(engine){
	PIXI.DisplayObjectContainer.call(this);
	this.engine=engine || getEngine();
	this.place={}; //info about current and prev places
	this.events={}
	this.players={}
	this.eventsInit({
		position: {x:0,y:0},
		width: 350, 
		height: this.engine.renderer.height, 
		border: {width: 30, height: 30},
		button: {width: 280, height: 50}
	});
	this.depth=-1;
	this.engine.stage.addChild(this);
}

Public.prototype= new PIXI.DisplayObjectContainer();
Public.prototype.constructor= Public;

Public.prototype.proceed= function () {
	for (var i in this.children)
		if (this.children[i].proceed)
			this.children[i].proceed();
}
	
Public.prototype.toggle= function () {
	if (this.visible)
		this.visible=false;
	else
		this.visible=true;
}

Public.prototype.switchTo= function (where) {
	switch (where){
		case 'events':
			this.events.container.visible=true;
			break;
	}
	this.place.prev=this.place.current;
	this.place.current=where; 
}
/*
{
	position:{
		x: int
		y: int
	}
	border:{	
		width: int
		height: int
	}
	button:{
		width: int
		height: int
	}
	width: int
	height: int
}
*/
Public.prototype.eventsInit= function (opt) {
	var engine=this.engine;
	var textures;
	var container=new ButtonContainer({position:{x:0,y:0}});
	this.events.container=container;
//	this.events.container.visible=false;
	container.depth=-1;
	this.addChild(container);
	
	textures=getTextureFrames(engine.textures.events_list_u);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.height/textures[0].height;
		container.addButton({sprite: new ATilingSprite(textures, {width: opt.width-opt.border.width*2, height: opt.border.height, scale:{x: scale,y: scale}}),position:{x:opt.position.x+opt.border.width,y:opt.position.y}});
	});
	textures=getTextureFrames(engine.textures.events_list_d);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.height/textures[0].height;
		container.addButton({sprite: new ATilingSprite(textures, {width: opt.width-opt.border.width*2, height: opt.border.height, scale:{x: scale,y: scale}}),position:{x:opt.position.x+opt.border.width,y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	});
	textures=getTextureFrames(engine.textures.events_list_l);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.width/textures[0].width;
		container.addButton({sprite: new ATilingSprite(textures, {width: opt.border.width, height: opt.height-opt.border.height*2, scale:{x: scale,y: scale}}),position:{x:opt.position.x,y:opt.position.y+opt.border.height},float: {y:'fixed'}});
	});
	textures=getTextureFrames(engine.textures.events_list_r);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.width/textures[0].width;
		container.addButton({sprite: new ATilingSprite(textures, {width: opt.border.width, height: opt.height-opt.border.height*2, scale:{x: scale,y: scale}}),position:{x:opt.position.x+opt.width-opt.border.width,y:opt.position.y+opt.border.height},float: {y:'fixed'}});
	});
	
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x,y:opt.position.y}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_ru), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x+opt.width-opt.border.width, y:opt.position.y}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_ld), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x, y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_rd), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x+opt.width-opt.border.width,y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	
	var border=(opt.width-opt.border.width*2-opt.button.width)/2;
	this.events.buttons = container.addButton({
		sprite: {textures: textures}, 
		position:{x:opt.border.width+border,y:opt.border.height},
		hitArea:{x:-(opt.width-opt.border.width*2-border*2),y:-(opt.height-opt.border.height*2),width: 2*(opt.width-opt.border.width*2-border*2),height: 2*(opt.height-opt.border.height*2)}, 
		float:{y:'fixed'},
		actions:["press","drag"]
	});
	this.events.buttons.keyPadInit({rows: 300, columns: 1, buttonSize: {x:opt.button.width,y:opt.button.height}, buttonDist: {x:0,y:5}, scrolling:{type: "vertical", area:{x:0,y:0,width: opt.width-opt.border.width*2-border*2,height: opt.height-opt.border.height*2}}});
	
/*
	var button=container.addButton({position:{x:20,y:20},actions:["press","drag"]});
	//button.addButton({sprite:{textures:t3,opt:{width:200,height:200}},focused:{textures:t2},position:{x:100,y:100},actions:["press","drag"]});
	button.keyPadInit({rows: 3, columns: 2, buttonSize: {x:100,y:100}, scrolling:{type: "vertical", area:{x:0,y:0,width: 215,height: 215}}});
	button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t2,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	var a=button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});	
*/
}

Public.prototype.eventsAdd= function (event) {
	if (!this.events.all)
		this.events.all={};
	var focused;
	if (engine.textures.events_list_button_focused)
		focused=new ASprite(getTextureFrames(engine.textures.events_list_button_focused));	
	//TODO: check style
	this.events.all[event.id]=this.events.buttons.keyPadAddButton({
		sprite: new ASprite(getTextureFrames(engine.textures.events_list_button)), 
		focused: focused,
		text:{
			data:locales[event.name], 
			position:{x:this.events.buttons.buttonSize.x/2,y:this.events.buttons.buttonSize.y/2},
			anchor:{x:0.5,y:0.45},
			style: {font: 'bold 16px Arial', fill: "#ffffff", stroke: "#000000",strokeThickness:2}
		},
		actions: ['press'],
		pressAction: this.eventsButtonAction
	}); 
	this.events.all[event.id].event=event;
	//TODO: add actions
}

Public.prototype.eventsRemove= function (event) {
	this.events.buttons.keyPadRemoveButton(this.events.all[event.id]);
	delete this.events.all[event.id];
}

//action on press button
Public.prototype.eventsButtonAction= function (event) {
	console.log(this.event);
}

