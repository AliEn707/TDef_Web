
var npc_types=[{
id: 0,
health: 400,
damage: 9,
shield: 200,
support: 0,
see_distanse: 4,
attack_distanse: 3,
attack_speed: 3,
move_speed: 1,
cost: 0,
receive: 500,
bullet_type: 2,
type: 1,
texidle: "npc/tree/il",
texwalkleft: "npc/tree/wl",
texwalkleftup: "npc/tree/wlu",
texwalkleftdown: "npc/tree/wld",
texwalkright: "npc/tree/wr",
texwalkrightup: "npc/tree/wru",
texwalkrightdown: "npc/tree/wrd",
texwalkup: "npc/tree/wu",
texwalkdown: "npc/tree/wd",
texattackright:  "npc/tree/ar",
texattackleft: "npc/tree/al",
texattackup: "npc/tree/au",
texattackdown: "npc/tree/ad",
texattackrightup:  "npc/tree/aru",
texattackrightdown:  "npc/tree/ard",
texattackleftup:  "npc/tree/alu",
texattackleftdown:  "npc/tree/ald",
},{
//- 0
	id: 1,
	health: 100,
	damage: 2,
	shield: 0,
	support: 0,
	see_distanse: 4,
	attack_distanse: 2,
	attack_speed: 4,
	move_speed: 1,
	cost: 10,
	receive: 5,
	bullet_type: 1,
	type: 1,
	textures:{
		idle:{
			src:"/imgtest/coin.png",
			frames: 10,
			frameSize: 100
		},
		walkleft:{
			src:"/imgtest/red.jpeg",
			frames: 1,
			frameSize: 225
		},
		walkright:{
			src:"/imgtest/5545.image_13D4E783.png",
			frameSize: 64
		},
	}
}
]


var engine = new TDefEngine(document.getElementById("gameDiv"),{webgl: false})
// create a texture from an image path
var texture = new PIXI.BaseTexture.fromImage("/imgtest/coin.png");
// create a new Sprite using the texture
var bunny = new ASprite([new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 100, 100))]);
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
for (var i=0;i<15;i++){	
	engine.mapObjects[i]=new Npc({type:1,x:Math.random()*size,y:Math.random()*size})
	engine.stage.addChild(engine.mapObjects[i])
}
