eng=new TDefEngine()
eng.init()
ctx=eng.ctx

var img= [new Image(),new Image(),new Image(),new Image(),new Image()]
img[0].src="/imgtest/coin.png"
img[1].src="/imgtest/green.jpg"
img[2].src="/imgtest/white.jpeg"
img[3].src="/imgtest/tree.jpeg"
img[4].src="/imgtest/red.jpeg"
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


			
//interval2=window.setInterval(function(){map.update()},1000/13)


eng.map=map