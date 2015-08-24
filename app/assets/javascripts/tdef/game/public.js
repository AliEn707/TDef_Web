function Public(){
	this.events={}
	var container=new ButtonContainer({position:{x:100,y:100}});
	container.addButton({sprite: {textures: t4,opt: {width:20,height:20}},position:{x:0,y:0}});
	container.addButton({sprite: {textures: t4,opt: {width:20,height:20}},position:{x:215+20,y:0}});
	container.addButton({sprite: {textures: t4,opt: {width:20,height:20}},position:{x:0,y:215+20}});
	container.addButton({sprite: {textures: t4,opt: {width:20,height:20}},position:{x:215+20,y:215+20}});
	container.addButton({sprite: {textures: t4,opt: {width:215,height:20}},position:{x:20,y:0}});
	container.addButton({sprite: {textures: t4,opt: {width:215,height:20}},position:{x:20,y:215+20}});
	container.addButton({sprite: {textures: t4,opt: {width: 20, height: 215}},position:{x:0,y:20}});
	container.addButton({sprite: {textures: t4,opt: {width: 20, height: 215}},position:{x:215+20,y:20}});
	var button=container.addButton({position:{x:20,y:20},actions:["press","drag"]});
	engine.stage.addChild(container);
	//button.addButton({sprite:{textures:t3,opt:{width:200,height:200}},focused:{textures:t2},position:{x:100,y:100},actions:["press","drag"]});
	button.keyPadInit({rows: 3, columns: 2, buttonSize: {x:100,y:100}, scrolling:{type: "vertical", area:{x:0,y:0,width: 215,height: 215}}});
	button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t2,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t3,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
	button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
var a=button.keyPadAddButton({sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});

}

Public.prototype.switchTo= function (where) {
	
}