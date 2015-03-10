function Wall(opt){
	opt=opt || {};
	PIXI.Sprite.call(this,opt);
	this.map=getEngine().map;

	
}
Wall.prototype= new PIXI.Sprite();
Wall.prototype.constructor= Wall;



Wall.prototype.updateTransform = function()
{
    // create some matrix refs for easy access
    var pt = this.parent.worldTransform;
    var wt = this.worldTransform;
 
    // temporary matrix variables
    var a, b, c, d, tx, ty;
 
    // TODO create a const for 2_PI 
    // so if rotation is between 0 then we can simplify the multiplication process..
        // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
        if(this.rotation !== this.rotationCache)
        {
            this.rotationCache = this.rotation;
            this._sr = -0.707//Math.sin(this.rotation);
            this._cr = 0.707//Math.cos(this.rotation);
        }
 
        // get the matrix values of the displayobject based on its transform properties..
        a  =  this._cr * this.scale.x;
        b  =  this._sr * this.scale.x;
        c  = -this._sr * this.scale.y;
        d  =  this._cr * this.scale.y;
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
 
 
    // multiply the alphas..
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};

//not work
Wall.prototype.updateTransform2 = function(){

/*
[	a	c	e
	b	d	f
	0	0	1
]*/
   	// TODO OPTIMIZE THIS!! with dirty
	this.localTransform = this.localTransform || [0,0,0,0,0,0,0,0,0];
	this.localTransform[0] = this.scale.x || 1//this._cr * this.scale.x;
	this.localTransform[1] = 0//Math.tan(this.skew) * this.scale.y;// -this._sr * this.scale.y
	this.localTransform[3] = 0//Math.tan(0.5);//this._sr * this.scale.x;
	this.localTransform[4] = this.scale.y || 1//this._cr * this.scale.y;
	
		///AAARR GETTER SETTTER!
	
	this.localTransform[2] = this.position.x - this.pivot.x * this.localTransform[0] || 0;
	this.localTransform[5] = this.position.y - this.pivot.y * this.localTransform[4] || 0;
	this.localTransform[8] = 1;
	// TODO optimize?
	this.worldTransform=this.mul3Matrix(this.parent.worldTransform);
	this.worldAlpha = this.alpha * this.parent.worldAlpha;		
}

Wall.prototype.mul3Matrix = function(b){
	var a=this.localTransform;
	var out=[];
	var a00 = a[0], a01 = a[1], a02 = a[2]
	var a10 = a[3], a11 = a[4], a12 = a[5]
	var a20 = a[6], a21 = a[7], a22 = a[8]
	var b00 = b[0], b01 = b[1], b02 = b[2]
	var b10 = b[3], b11 = b[4], b12 = b[5]
	var b20 = b[6], b21 = b[7], b22 = b[8]
	out[0] = b00 * a00 + b01 * a10 + b02 * a20
	out[1] = b00 * a01 + b01 * a11 + b02 * a21
	out[2] = b00 * a02 + b01 * a12 + b02 * a22
	out[3] = b10 * a00 + b11 * a10 + b12 * a20
	out[4] = b10 * a01 + b11 * a11 + b12 * a21
	out[5] = b10 * a02 + b11 * a12 + b12 * a22
	out[6] = b20 * a00 + b21 * a10 + b22 * a20
	out[7] = b20 * a01 + b21 * a11 + b22 * a21
	out[8] = b20 * a02 + b21 * a12 + b22 * a22
	return out
}