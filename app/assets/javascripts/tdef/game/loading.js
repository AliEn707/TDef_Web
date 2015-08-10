var Loading={
	init: function (opt){
		opt=opt || {}
		var engine=opt.engine || getEngine();
		var textures=getTextureFrames(engine.textures.loading_background)
		var opts={sprite:{textures:textures, opt:{width:engine.renderer.width,height:engine.renderer.height,anchor:{x:0,y:0}},position:{x:0,y:0},actions:[]}};
		Loading.object=new ButtonContainer(opts);
			
		var t=getTextureFrames(engine.textures.loading);
		opts={sprite:{textures:t, opt:{anchor:{x:0.5,y:0.5}}}};
		var animation=Loading.object.addButton(opts);
		animation.position.x=Loading.object.width/2;
		animation.position.y=Loading.object.height/2;
		
		Loading.object.resize= function(){
			var e=engine;
			this.width=e.renderer.width;
			this.height=e.renderer.height;
			animation.position.x=this.width/2;
			animation.position.y=this.height/2;
		}
		engine.stage.addChild(Loading.object);
	},
	show:function (){
		Loading.object.visible=true
	},
	hide:function (){
		Loading.object.visible=false
	}
}

