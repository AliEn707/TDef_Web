function statsFps(){
	return parseInt(stats.domElement.children.fps.children.fpsText.innerHTML) | 0;
}

function statsMs(){
	return parseFloat(stats.domElement.children.ms.children.msText.innerHTML);
}

function statsShow(engine){
	var size=20;
	var textures=getTextureFrames(engine.textures.stats);
	engine.stats=new ButtonContainer({
		engine: engine,
		sprite:{
			textures: textures, 
			opt:{
				width:150,
				height:size,
			}
		},
		position: {
			x: 0, 
			y: engine.renderer.height-size, 
			float:{
				y:"fixed"
			}
		},
		text:{
			data:"fps: 0, ms: 0",
			position: {
				x: 24,
				y: 1
			},
			style: {
				font: '13px Arial',
				fill: "#ffffff", 
				stroke: "#000000",
				strokeThickness:2
			}
		}
	});
	engine.stats.depth=-10;
	engine.stage.addChild(engine.stats);
}

function statsUpdate(engine){
	if (engine.stats)
		engine.stats.text.setText("fps: "+statsFps()+", ms: "+statsMs());
}