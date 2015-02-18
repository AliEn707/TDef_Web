
var engine = new TDefEngine(document.getElementById("gameDiv"))
// create a texture from an image path
var texture = new PIXI.BaseTexture.fromImage("coin.png");
// create a new Sprite using the texture
var bunny = new ASprite(new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 100, 100)));
for (var i =1;i<10;i++)
	bunny.setFrame(i, new PIXI.Texture(texture, new PIXI.Rectangle(100*i, 0, 100, 100)))
// center the sprites anchor point
//	bunny.anchor.x = 0.5;
//	bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
//	bunny.position.x = 200;
//	bunny.position.y = 150;

//	stage.addChild(bunny);

var atlas = new PIXI.BaseTexture.fromImage("/imgtest/green.jpg");
//	var a=new Grid(5)
var size=15
var nodes=[]
var outnodes=[[],[],[],[]]
for(var i=0;i<4;i++)
	for(var j=0;j<engine.outerSize(size);j++)
		outnodes[i].push(1)
for (var i =0;i<size*size;i++)
	nodes.push(0)
//	a.setFrame(0,new PIXI.Texture(atlas, new PIXI.Rectangle(0, 0, 100, 100)))
engine.setMap({size: size, nodes: nodes, outerNodes: outnodes, textures: [new PIXI.Texture(atlas, new PIXI.Rectangle(0, 0, 128, 128)),new PIXI.Texture.fromImage("/imgtest/tree.jpeg")]})
//engine.stage.addChild(bunny)
	
	