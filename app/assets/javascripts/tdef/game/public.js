function Public(engine){
	this.engine=engine || getEngine();
	this.events={}
	this.players={}
	this.eventsInit({position:{x:0,y:0},width: 300, height:this.engine.renderer.height, border:{width: 30, height: 30},button:{width: 200, height: 50}});
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
	container.depth=-1;
	engine.stage.addChild(container);
	
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
	this.events.buttons = container.addButton({sprite: {textures: textures}, position:{x:opt.border.width+border,y:opt.border.height},float:{y:'fixed'},actions:["press","drag"]});
	this.events.buttons.keyPadInit({rows: 300, columns: 1, buttonSize: {x:opt.button.width,y:opt.button.height}, scrolling:{type: "vertical", area:{x:0,y:0,width: opt.width-opt.border.width*2-border*2,height: opt.height-opt.border.height*2}}});
	
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
	
}


