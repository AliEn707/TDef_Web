function Wall(opt){
	opt=opt || {};
	PIXI.SpriteBatch.call(this);
	this.map=getEngine().map;

	
}
Wall.prototype= new PIXI.SpriteBatch()//DisplayObjectContainer();
Wall.prototype.constructor= Wall;

