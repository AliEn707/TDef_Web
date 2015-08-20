//TODO: add text #loading 
var Loading={
	init: function (opt, callback){
		opt=opt || {}
		var engine=opt.engine || getEngine();
		var textures=getTextureFrames(engine.textures.loading_background)
		afterTextureLoad(textures[0],function (){
			var size=fitDimensions({width:engine.renderer.width,height:engine.renderer.height},{width:textures[0].width,height:textures[0].height});
			var opts={sprite:{textures:textures, opt:{width:size.width,height:size.height,anchor:{x:0.5,y:0.5}}},actions:["drag"]};
			Loading.object=new ButtonContainer(opts);
			//next need to stop gragging on other objects (used with actions[drag])
			Loading.object.mousemove=Loading.object.touchmove=false//function () {};
			Loading.object.mouseweel=function(){};
			Loading.object.position={x:engine.renderer.width/2,y:engine.renderer.height/2}
			Loading.object.depth=-100;
			var t=getTextureFrames(engine.textures.loading);
			var opts={sprite:{textures:t, opt:{anchor:{x:0.5,y:0.5}}}};
			var animation=Loading.object.addButton(opts);
			Loading.object.resize= function(){
				var e=engine;
				var size=fitDimensions({width:engine.renderer.width,height:engine.renderer.height},{width:textures[0].width,height:textures[0].height});
				this.width=size.width;
				this.height=size.height;
				this.position.x=engine.renderer.width/2;
				this.position.y=engine.renderer.height/2;
				this.hitArea={x: -engine.renderer.width/2, y: -engine.renderer.height/2, width: engine.renderer.width, height: engine.renderer.height}
			}
			Loading.object.resize();
			Loading.hide();
			engine.stage.addChild(Loading.object);	
			if (callback)
				callback();
		})
	},
	show:function (){
		if (Loading.object)
			Loading.object.visible=true
	},
	hide:function (){
		if (Loading.object)
			Loading.object.visible=false
	},
	setText: function (){
		//set text on screen
	}
}

