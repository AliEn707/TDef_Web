var img= [new Image(),new Image(),new Image(),new Image(),new Image()]
img[0].src="/coin-sprite-animation.png"
img[1].src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRunb53FDsq5Uu9Gc5BKvG2b0WSn208nXsNMNyeJdZmqAbRSSBDIw"
img[2].src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbP48sj4NMaziS9xmqyaatqtVx8PGCOoJbQV8s0gPoy0HaGckl5A"
img[3].src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQPrHL2Kl_wsEtoOFmcPWeZvHV0t7po4hUBjdFT4Kxhb9XX2PjVAw"
img[4].src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYfyynF7Rwh3zwVIOK_a13j0xNSy-s3RNAl4zytBxVP3E6Qv4rjw"
//var sprite=new Sprite({image: img[0], context: ctx, loop: 1, tpf: 3, frames: 10})
var textures=[new Sprite({image: img[0], context: ctx, loop: 1, tpf: 3, frames: 10}),
			new Sprite({image: img[1], context: ctx, loop: 1, tpf: 3, frames: 1}),
			new Sprite({image: img[2], context: ctx, loop: 1, tpf: 3, frames: 1}),
			new Sprite({image: img[3], context: ctx, loop: 1, tpf: 3, frames: 1}),
			new Sprite({image: img[4], context: ctx, loop: 1, tpf: 3, frames: 1}),
			]
var size=15
var grid=[]
for(var i=0;i<size*size;i++)
	grid.push({tex_id:parseInt((Math.random()*10)%2)})
var outernodes=[[],[],[],[]]
for(var i=0;i<size*size;i++)
	for(var j=0;j<4;j++)
		outernodes[j].push({tex_id:parseInt((Math.random()*10)%3+2)})
	

var map=new Map({scale: 0.6, x: 300, y: 300, grid: grid, outernodes: outernodes, size:size, nodesize:100, ctx: ctx, textures: textures})
ctx.drawImage(img[4],0,0)
map.update()
//map.draw(ctx)

interval1=window.setInterval(function(){
		textures[0].update();
		//map.update()
		map.draw(ctx)
		textures[0].draw(ctx,0,0,{})
			},5)
			
interval2=window.setInterval(function(){map.update()},1000/13)