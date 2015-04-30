
/***
for storing delays
Migration:

$ rails g migration add_location_data_to_users location_data:text

should create:

class Migration0001
  def change
    add_column :users, :location_data, :text
  end
end

Your Class Would Look Like:

class User < ActiveRecord::Base
  serialize :location_data
end

Available Actions:

b = User.new
b.location_data = [1,2,{foot: 3, bart: "noodles"}]
b.save

***/

var npc_types={
	0:{
		id: 0,
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
				src:"/imgtest/wr.png",
				frames: 8,
				height: 128,
			},
			walk:{ //the same as walk_left, need to normal sprite switching, need to change later
				src:"/imgtest/wl.png",
				frames: 8,
				height: 128,
			},
			walk_left:{
				src:"/imgtest/wl.png",
				frames: 8,
				height: 128,
			},
			walk_up:{
				src:"/imgtest/wu.png",
				frames: 8,
				height: 128,
			},
			walk_down:{
				src:"/imgtest/wd.png",
				frames: 8,
				height: 128,
			},
			walk_leftup:{
				src:"/imgtest/wlu.png",
				frames: 8,
				height: 128,
			},
			walk_leftdown:{
				src:"/imgtest/wld.png",
				frames: 8,
				height: 128,
			},
			walk_right:{
				src:"/imgtest/wr.png",
				frames: 8,
				height: 128,
			},
			walk_rightup:{
				src:"/imgtest/wru.png",
				frames: 8,
				height: 128,
			},
			walk_rightdown:{
				src:"/imgtest/wrd.png",
				frames: 8,
				height: 128,
			},
			attack:{
				src:"/imgtest/al.png",
				frames: 6,
				height: 128,
			},
			attack_left:{
				src:"/imgtest/al.png",
				frames: 6,
				height: 128,
			},
			attack_leftup:{
				src:"/imgtest/alu.png",
				frames: 6,
				height: 128,
			},
			attack_up:{
				src:"/imgtest/au.png",
				frames: 6,
				height: 128,
			},
			attack_rightup:{
				src:"/imgtest/aru.png",
				frames: 6,
				height: 128,
			},
			attack_right:{
				src:"/imgtest/ar.png",
				frames: 6,
				height: 128,
			},
			attack_rightdown:{
				src:"/imgtest/ard.png",
				frames: 6,
				height: 128,
			},
			attack_down:{
				src:"/imgtest/ad.png",
				frames: 6,
				height: 128,
			},
			attack_leftdown:{
				src:"/imgtest/ald.png",
				frames: 6,
				height: 128,
			},
		}
	},
	1:{
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
				src:"/imgtest/wr.png",
				frames: 8,
				height: 128,
			},
			walk:{ //the same as walk_left, need to normal sprite switching, need to change later
				src:"/imgtest/wl.png",
				frames: 8,
				height: 128,
			},
			walk_left:{
				src:"/imgtest/wl.png",
				frames: 8,
				height: 128,
			},
			walk_up:{
				src:"/imgtest/wu.png",
				frames: 8,
				height: 128,
			},
			walk_down:{
				src:"/imgtest/wd.png",
				frames: 8,
				height: 128,
			},
			walk_leftup:{
				src:"/imgtest/wlu.png",
				frames: 8,
				height: 128,
			},
			walk_leftdown:{
				src:"/imgtest/wld.png",
				frames: 8,
				height: 128,
			},
			walk_right:{
				src:"/imgtest/wr.png",
				frames: 8,
				height: 128,
			},
			walk_rightup:{
				src:"/imgtest/wru.png",
				frames: 8,
				height: 128,
			},
			walk_rightdown:{
				src:"/imgtest/wrd.png",
				frames: 8,
				height: 128,
			},
			attack:{
				src:"/imgtest/al.png",
				frames: 6,
				height: 128,
			},
			attack_left:{
				src:"/imgtest/al.png",
				frames: 6,
				height: 128,
			},
			attack_leftup:{
				src:"/imgtest/alu.png",
				frames: 6,
				height: 128,
			},
			attack_up:{
				src:"/imgtest/au.png",
				frames: 6,
				height: 128,
			},
			attack_rightup:{
				src:"/imgtest/aru.png",
				frames: 6,
				height: 128,
			},
			attack_right:{
				src:"/imgtest/ar.png",
				frames: 6,
				height: 128,
			},
			attack_rightdown:{
				src:"/imgtest/ard.png",
				frames: 6,
				height: 128,
			},
			attack_down:{
				src:"/imgtest/ad.png",
				frames: 6,
				height: 128,
			},
			attack_leftdown:{
				src:"/imgtest/ald.png",
				frames: 6,
				height: 128,
			},
		}
	}
}

var tower_types={
	0:{
		id: 0,
		health: 200,
		textures:{
			idle:{
				src:"/imgtest/tower.png",
				frames: 1,
				height: 512,
			},
		},
	},
	1:{
		id: 1,
		health: 200,
		damage: 20,
		energy: 0,
		shield: 0,
		attack_distanse: 3,
		attack_speed: 2,
		cost: 40,
		receive: 10,
		name: "Base",
		bullet_type: 1,
		textures:{
			idle:{
				src:"/imgtest/tower.png",
				frames: 1,
				height: 512,
			},
		},
	},
	2:{
		id: 2,
		health: 250,
		damage: 40,
		energy: 0,
		shield: 0,
		attack_distanse: 2,
		attack_speed: 4,
		cost: 30,
		receive: 5,
		bullet_type: 1,
		effect:{
			speed: 0,
			damage: 0,
			shield: 0,
			status: 0,
			time: 0,
		},
		textures:{
			idle:{
				src:"/imgtest/tower.png",
				frames: 1,
				height: 512,
			},
		},
	},
}

var bullet_types={
	1:{
		id: 1,
		move_type: 2,
		attack_type: 1,
		speed: 1.2,
		solid: 0,
		textures:{
			idle:{
				src: "/imgtest/bullet.png",
				frames: 1,
				height: 256,
				width:64,
			},
		},
	},
	2:{
		id: 2,
		name: "solid",
		move_type: 1,
		attack_type: 1,
		speed: 0,
		solid: 1,
		textures:{
			idle:{
				src: "/imgtest/solid_bullet.png",
				frames: 1,
				height: 256,
				width: 64,
				delays:{
					last_frame: 0.2,
				}
			},
		},
	},
	3:{
		id: 3,
		move_type: 2,
		attack_type: 1,
		speed: 2,
		textures:{
			idle:{
				src: "/imgtest/bullet.png",
				frames: 1,
				height: 256,
				width:64,
			},
		},
	},
	4:{
		id: 4,
		speed: 0,
		textures:{
			idle:{
				src: "/imgtest/bullet.png",
				frames: 1,
				height: 256,
				width:64,
			},
		},
	},
	5:{
		id: 5,
		speed: 0,
		textures:{
			idle:{
				src: "/imgtest/bullet.png",
				frames: 1,
				height: 256,
				width:64,
			},
		},
	}
}


var engine = new TDefEngine(document.getElementById("gameDiv"),
						{
							webgl: true, 
							frameTime:1000/30, 
							textures:{
								health: {
									src:"/imgtest/health.png"
								}, 
								tower_set_background:{
									src:"/imgtest/build.png"
								},
								npc_set_background:{
									src:"/imgtest/build.png"
								}
							}
						});
// create a texture from an image path
var texture = new PIXI.BaseTexture.fromImage("/imgtest/coin.png");
// create a new Sprite using the texture
//var bunny = new ASprite([new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 100, 100))]);
//for (var i =1;i<10;i++)
//	bunny.setFrame(i, new PIXI.Texture(texture, new PIXI.Rectangle(100*i, 0, 100, 100)))
// center the sprites anchor point
//	bunny.anchor.x = 0.5;
//	bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
//	bunny.position.x = 200;
//	bunny.position.y = 150;

//	stage.addChild(bunny);

//var atlas = new PIXI.Texture.fromImage("/imgtest/green.jpg")
var atlas = new PIXI.BaseTexture.fromImage("/imgtest/red.jpeg");
//	var a=new Grid(5)
var size=30
var nodes=[]
var outnodes=[[],[],[],[]]
for(var i=0;i<4;i++)
	for(var j=0;j<engine.outerSize(size);j++)
		outnodes[i].push(1)
for (var i =0;i<size*size;i++)
	nodes.push(0)
//	a.setFrame(0,new PIXI.Texture(atlas, new PIXI.Rectangle(0, 0, 100, 100)))
engine.setMap("4")//map must be on server
//engine.stage.addChild(bunny)
data=[
	{msg:3,id:90,objtype:"Bullet",create:1,grid:{$:0,x:24.374,y:29.4},$:0,type:2,owner:1,source:{$:0,x:27.125,y:28.5},$:0},
	{msg:3,id:90,objtype:"Bullet",create:1,grid:{$:0,x:27.125,y:28.5},$:0,type:2,owner:2,source:{$:0,x:24.374,y:29.4},$:0},
	{msg:3,id:90,objtype:"Bullet",create:1,grid:{$:0,y:24.374,x:29.4},$:0,type:2,owner:1,source:{$:0,y:27.125,x:28.5},$:0},
	{msg:3,id:90,objtype:"Bullet",create:1,grid:{$:0,y:27.125,x:28.5},$:0,type:2,owner:2,source:{$:0,y:24.374,x:29.4},$:0},
]
for (var i=0;i<1;i++){	
//	engine.map.objects[i]=new Npc({type:1,grid:{x:2.6/*Math.random()*size*/,y:1/*Math.random()*size*/}})
//	engine.map.objects[i]=new Tower({})
//	engine.map.objects[i]=new Bullet(data[i])
//	engine.map.objects[i].update({grid:{x:2,y:2},time: 1});
//	engine.map.objects[i].update({grid:{x:5,y:5},time: 5000});
//	engine.stage.addChild(engine.map.objects[i])
}

//var t=PIXI.Texture.fromImage("/imgtest/red.jpeg");
//var tile=new PIXI.TilingSprite(t,400,100)
//var tile=new ATilingSprite([t],{loop:true, width: 400, height:100})
//engine.stage.addChild(tile)

//var t1=[PIXI.Texture.fromImage("/imgtest/tree.jpeg")];
//var t2=getTextureFrames(npc_types[0].textures["idle"]);
//var t3=[PIXI.Texture.fromImage("/imgtest/build.png")];

//engine.map.objects["button"]=new ButtonContainer({sprite:{textures:t3,opt:{width:400,height:400}},focused:{textures:t2},position:{x:100,y:100},actions:["press","drag"]});
//engine.map.objects["button"].keyPadInit({rows: 3, columns: 1, buttonSize: {x:100,y:100}});
//engine.map.objects["button"].keyPadAddButton(4,{sprite:{textures:t1,opt:{width:200,height:200}},position:{x:40,y:40},actions:["press","drag"],pressAction:function(){alert("pressed")}});
//engine.stage.addChild(engine.map.objects["button"]);
