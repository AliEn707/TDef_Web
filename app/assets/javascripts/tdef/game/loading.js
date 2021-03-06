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
			var animation=Loading.object.addButton({
				sprite:{
					textures:t, 
					opt:{anchor:{x:0.5,y:1}}
				},
				text:{
					data: "#loading", 
					position: {x: 0, y: 0}, 
					anchor:{x:0.5,y:0}, 
					style: {
						fill: "#ffffff", 
						stroke: "#000000",
						strokeThickness:2
					}
				}
			});
			Loading._message=animation.addButton({
				position: {
					x: 0, 
					y: 200, 
					float:{
						y:"float"
					}
				},
				text:{
					data: "".translate, 
					position: {x: 0, y: 0}, 
					anchor:{x:0.5,y:0}, 
					style: {
						font: 'bold 20px Arial',
						fill: "#ffffff", 
						stroke: "#000000",
						strokeThickness:2
					}
				}
			});
			Loading.object.resize= function(width,height){
				var e=engine;
				var size=fitDimensions({width: width,height: height},{width:textures[0].width,height:textures[0].height});
				this.width=size.width;
				this.height=size.height;
				this.position.x=width/2;
				this.position.y=height/2;
				this.hitArea={x: -width/2, y: -height/2, width: width, height: height}
				for(var i in this.children)
					if (this.children[i].resize)
						this.children[i].resize(width,height)
			}
			Loading.object.resize(engine.renderer.width,engine.renderer.height);
			Loading.hide();
			engine.stage.addChild(Loading.object);	
			if (callback)
				callback();
		})
	},
	show:function (text){
		if (Loading.object)
			Loading.object.visible=true
		if (text)
			Loading.message=text;
	},
	hide:function (){
		if (Loading.object)
			Loading.object.visible=false
	},
	setText: function (){
		//set text on screen
	}
}

Object.defineProperty(Loading, 'message', {
    get: function() {
	return  this._message.text.text;
    },    
    set: function(value) {
	return  this._message.text.setText(value.translate);
    }
});
