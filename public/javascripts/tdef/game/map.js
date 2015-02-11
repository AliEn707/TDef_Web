function Map(obj){
	this.size=obj.size
	this.grid=new Array(this.size*this.size)
	
}

Map.prototype.setSize=function (size){
	this.size=size
}