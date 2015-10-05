function statsFps(){
	return stats.fps;
}

function statsMs(){
	return stats.ms;
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
		engine.stats.text.setText("fps: "+parseInt(statsFps())+", ms: "+parseInt(statsMs()*100)/100);
}

function Stats(){
	this.frames=0;
	this.prev = this.now();
}

Stats.prototype.now=( self.performance && self.performance.now ) ? self.performance.now.bind( performance ) : Date.now;
Stats.prototype.constructor=Stats;

Stats.prototype.setMode = function (){};
Stats.prototype.begin = function (){
	this.time=this.now();
}

Stats.prototype.update = function (){
	this.time=this.end();
}

Stats.prototype.end = function (){
	var time=this.now();
  if (!this.freeze){
    this.ms = time - this.time;
    this.frames++;
    if ( time > this.prev + 1000 ) {
      this.fps =( this.frames * 1000 ) / ( time - this.prev);
      this.prev = time;
      this.frames = 0;
    }
  }
}