function Wall(opt){
	opt=opt || {};
	PIXI.Sprite.call(this,opt.tex);
	this.map=getEngine().map;
	this.position=this.map.getPosition(opt.pos);
	this.width=this.map.nodesize*1.3;
	this.height=this.map.nodesize*1.3;
	this.type=opt.type;
	this.shift={y:0,x:0};
	if (this.type=="x"){
		this.rotation=Math.PI/2;
		this.anchor.x=-0.3817;
		this.anchor.y=1.3817;
		this.shift.y=1;
	}else{
//		this.rotation=-Math.PI/2;
		this.width*=-1;
		this.shift.y=1;
		this.anchor.y=0.237+0.3817;
		this.anchor.x=1.5267-0.3817;
	}
}
Wall.prototype= new PIXI.Sprite();
Wall.prototype.constructor= Wall;



Wall.prototype.updateTransform = function()
{
    // create some matrix refs for easy access
    var pt = this.parent.worldTransform;
    var wt = {};
    
    // temporary matrix variables
    var a, b, c, d, tx, ty;
	
    // TODO create a const for 2_PI 
    // so if rotation is between 0 then we can simplify the multiplication process..
        // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
        if(this.rotation !== this.rotationCache)
        {
            this.rotationCache = this.rotation;
            this._sr = Math.sin(this.rotation);
            this._cr = Math.cos(this.rotation);
        }
 
        // get the matrix values of the displayobject based on its transform properties..
        a  =  this.scale.x * this._cr;
        b  =  this.scale.x * this._sr;
        c  =  this.scale.y * -this._sr;
        d  =  this.scale.y * this._cr;
        tx =  this.position.x;
        ty =  this.position.y;
        
        // check for pivot.. not often used so geared towards that fact!
        if(this.pivot.x || this.pivot.y)
        {
            tx -= this.pivot.x * a + this.pivot.y * c;
            ty -= this.pivot.x * b + this.pivot.y * d;
        }
 
        // concat the parent matrix with the objects transform.
        wt.a  = a  * pt.a + b  * pt.c;
        wt.b  = a  * pt.b + b  * pt.d;
        wt.c  = c  * pt.a + d  * pt.c;
        wt.d  = c  * pt.b + d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
	
	pt=wt;
	wt = this.worldTransform;
    
	a  =  1
        b  =  this.shift.x// * this._sr;
        c  =  this.shift.y// * -this._sr;
        d  =  1
        tx =  0
        ty =  0
        
          // concat the parent matrix with the objects transform.
        wt.a  = a  * pt.a + b  * pt.c;
        wt.b  = a  * pt.b + b  * pt.d;
        wt.c  = c  * pt.a + d  * pt.c;
        wt.d  = c  * pt.b + d  * pt.d;
        wt.tx = tx * pt.a + ty * pt.c + pt.tx;
        wt.ty = tx * pt.b + ty * pt.d + pt.ty;
 
 
    // multiply the alphas..
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};
