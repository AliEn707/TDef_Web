function Public(engine){
	this.engine=engine || getEngine();
	this.events={}
	this.players={}
	this.eventsInit({position:{x:0,y:0},width: 300, height:this.engine.renderer.height, border:{width: 30, height: 30}});
}

Public.prototype.switchTo= function (where) {
	
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
	width: int
	height: int
}
*/
Public.prototype.eventsInit= function (opt) {
	var engine=this.engine;
	var sprite;
	var container=new ButtonContainer({position:{x:0,y:0}});
	this.events.container=container;
	container.depth=-1;
	engine.stage.addChild(container);

	sprite=new ATilingSprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.width-opt.border.width*2, height: opt.border.height})
	console.log(clone(sprite.scale))
	container.addButton({sprite: new ATilingSprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.width-opt.border.width*2, height: opt.border.height}),position:{x:opt.position.x+opt.border.width,y:opt.position.y}});
	container.addButton({sprite: new ATilingSprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.width-opt.border.width*2, height: opt.border.height}),position:{x:opt.position.x+opt.border.width,y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	container.addButton({sprite: new ATilingSprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.border.width, height: opt.height-opt.border.height*2}),position:{x:opt.position.x,y:opt.position.y+opt.border.height},float: {y:'fixed'}});
	container.addButton({sprite: new ATilingSprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.border.width, height: opt.height-opt.border.height*2}),position:{x:opt.position.x+opt.width-opt.border.width,y:opt.position.y+opt.border.height},float: {y:'fixed'}});
	
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_lu), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x,y:opt.position.y}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_ru), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x+opt.width-opt.border.width, y:opt.position.y}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_ld), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x, y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	container.addButton({sprite: new ASprite(getTextureFrames(engine.textures.events_list_rd), {width: opt.border.width, height: opt.border.height}),position:{x:opt.position.x+opt.width-opt.border.width,y:opt.position.y+opt.height-opt.border.height, float: {y:'fixed'}}});
	
/*
	container.addButton({sprite: {textures: t4,opt: {width:215,height:20}},position:{x:20,y:0}});
	container.addButton({sprite: {textures: t4,opt: {width:215,height:20}},position:{x:20,y:215+20}});
	container.addButton({sprite: {textures: t4,opt: {width: 20, height: 215}},position:{x:0,y:20}});
	container.addButton({sprite: {textures: t4,opt: {width: 20, height: 215}},position:{x:215+20,y:20}});
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


