function Public(engine){
	PIXI.DisplayObjectContainer.call(this);
	this.objects=['events'];
	this.engine=engine || getEngine();
	this.place={}; //info about current and prev places
	this.players={}
	//init
	var menuButton={width: 100, height: 40};
	this.menuInit({
		position:{x:0,y:0},
		button: menuButton,
		screen: this.engine.renderer
	});
	
	this.eventsInit({
		position: {x:0,y: menuButton.height},
		width: 350, 
		height: this.engine.renderer.height-menuButton.height, 
		border: {width: 30, height: 30},
		button: {width: 280, height: 50}
	});
	this.depth=-1;
	this.toggle();
	this.engine.stage.addChild(this);
}

Public.prototype= new PIXI.DisplayObjectContainer();
Public.prototype.constructor= Public;

Public.prototype.proceed= function () {
	for (var i in this.children)
		if (this.children[i].proceed)
			this.children[i].proceed();
}
	
Public.prototype.resize= function (w,h) {
	for (var i in this.children)
		if (this.children[i].resize)
			this.children[i].resize(w,h);
}
	
Public.prototype.toggle= function () {
	if (this.visible)
		this.visible=false;
	else
		this.visible=true;
}

Public.prototype.switchTo= function (where) {
	switch (where){
		case 'events':
			this.events.container.visible=true;
			break;
	}
	this.place.prev=this.place.current;
	this.place.current=where; 
}

/* main menu
{
	button: {
		width: int
		height: int
	}
	position:{
		x: int
		y: int
	}
	screen:{
		width: int
		height: int
	}
}
*/
Public.prototype.menuInit= function (opt) {
	var engine=this.engine || getEngine();
	var container=new ButtonContainer({position:{x:opt.position.x,y:opt.position.y}});
	this.menu={};
	this.menu.container=container;
	this.addChild(container);
	var that=this;
//TODO: change to message area, add message list, and processor
	textures=getTextureFrames(engine.textures['menu_message_backgound']);
	afterTextureLoad(textures[0], function (){
		(function(){
			var scale={x: opt.button.width/textures[0].width, y: opt.button.height/textures[0].height}
			this.message = container.addButton({
				sprite: new ATilingSprite(textures, {
					width: opt.screen.width-opt.button.width*this.objects.length, 
					height: opt.button.height,
					scale: scale
				}),
				position:{
					x:opt.position.x+opt.button.width*this.objects.length,
					y:0
				},
				float: {x:'fixed'}
			});

		//butttons	
			this.menu.buttons = container.addButton({
				position:{
					x:opt.position.x,
					y:opt.position.y
				},
			});
			this.menu.buttons.keyPadInit({
				rows: 1, 
				columns: this.objects.length, 
				buttonSize: {
					x:opt.button.width,
					y:opt.button.height
				}, 
				buttonDist: {x:0,y:0}
			});
				
			for (var i in this.objects){
				var place=this;
				var obj=this.objects[i];
				var name='#'+obj+'_menu_button';
				var text=locales[name] || name;
				var button='menu_button';
				var focused;
				if (engine.textures[button+'_'+obj])
					button+='_'+obj;
				if (engine.textures[button+'_focused'])
					focused=new ASprite(getTextureFrames(engine.textures[button+'_focused']));
				var b = this.menu.buttons.keyPadAddButton({
					sprite: new ASprite(getTextureFrames(engine.textures[button])), 
					focused: focused,
					text:{
						data: text, 
						position:{
							x:opt.button.width/2,
							y:opt.button.height/2
						},
						anchor:{x:0.5,y:0.45},
						style: {font: 'bold 16px Arial', fill: "#ffffff", stroke: "#000000",strokeThickness:2}
					},
					actions: ['press'],
					pressAction: (function(p,o){
						return function(){
							p.switchTo(o); //TODO: add other actions
						};
					})(place,obj)//odd
				}); 
			}
		}).call(that)
	});
}

/*    events
{
	position:{
		x: int
		y: int
	}
	border:{	
		width: int
		height: int
	}
	button:{
		width: int
		height: int
	}
	width: int
	height: int
}
*/
Public.prototype.eventsInit= function (opt) {
	var engine=this.engine || getEngine();
	var textures;
	var container=new ButtonContainer({position:{x:opt.position.x,y:opt.position.y}});
	this.events={}
	this.events.container=container;
	this.events.container.visible=false;
	this.addChild(container);
	
	textures=getTextureFrames(engine.textures.events_list_u);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.height/textures[0].height;
		container.addButton({
			sprite: new ATilingSprite(textures, {
				width: opt.width-opt.border.width*2, 
				height: opt.border.height, 
				scale:{x: scale,y: scale}
			}),
			position:{
				x:opt.border.width,
				y:0
			}
		});
	});
	textures=getTextureFrames(engine.textures.events_list_d);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.height/textures[0].height;
		container.addButton({
			sprite: new ATilingSprite(textures, {
				width: opt.width-opt.border.width*2, 
				height: opt.border.height, 
				scale:{x: scale,y: scale}
			}),
			position:{
				x:opt.border.width,
				y:opt.height-opt.border.height, 
				float: {y:'fixed'}
			}
		});
	});
	textures=getTextureFrames(engine.textures.events_list_l);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.width/textures[0].width;
		container.addButton({
			sprite: new ATilingSprite(textures, {
				width: opt.border.width, 
				height: opt.height-opt.border.height*2, 
				scale:{x: scale,y: scale}
			}),
			position:{
				x:0,
				y:opt.border.height
			},
			float: {y:'fixed'}
		});
	});
	textures=getTextureFrames(engine.textures.events_list_r);
	afterTextureLoad(textures[0], function (){
		var scale=opt.border.width/textures[0].width;
		container.addButton({
			sprite: new ATilingSprite(textures, {
				width: opt.border.width, 
				height: opt.height-opt.border.height*2, 
				scale:{x: scale,y: scale}
			}),
			position:{
				x:opt.width-opt.border.width,
				y:opt.border.height
			},
			float: {y:'fixed'}
		});
	});
	
	container.addButton({
		sprite: new ASprite(getTextureFrames(engine.textures.events_list_lu), {
			width: opt.border.width, 
			height: opt.border.height
		}),
		position:{
			x:0,
			y:0
		}
	});
	container.addButton({
		sprite: new ASprite(getTextureFrames(engine.textures.events_list_ru), {
			width: opt.border.width, 
			height: opt.border.height
		}),
		position:{
			x:opt.width-opt.border.width, 
			y:0
		}
	});
	container.addButton({
		sprite: new ASprite(getTextureFrames(engine.textures.events_list_ld), {
			width: opt.border.width, 
			height: opt.border.height
		}),
		position:{
			x:0, 
			y:opt.height-opt.border.height, 
			float: {y:'fixed'}
		}
	});
	container.addButton({
		sprite: new ASprite(getTextureFrames(engine.textures.events_list_rd), {
			width: opt.border.width, 
			height: opt.border.height
		}),
		position:{
			x:opt.width-opt.border.width,
			y:opt.height-opt.border.height, 
			float: {y:'fixed'}
		}
	});
	
	var border=(opt.width-opt.border.width*2-opt.button.width)/2;
	this.events.buttons = container.addButton({
		sprite: {textures: textures}, 
		position:{
			x:opt.border.width+border,
			y:opt.border.height
		},
		hitArea:{
			x:-(opt.width-opt.border.width*2-border*2),
			y:-(opt.height-opt.border.height*2),
			width: 2*(opt.width-opt.border.width*2-border*2),
			height: 2*(opt.height-opt.border.height*2)
		}, 
		float:{y:'fixed'},
		actions:["press","drag"]
	});
	this.events.buttons.keyPadInit({
		rows: 300, 
		columns: 1, 
		buttonSize: {
			x:opt.button.width,
			y:opt.button.height
		}, 
		buttonDist: {x:0,y:5}, 
		scrolling:{
			type: "vertical", 
			area:{
				x:0,
				y:0,
				width: opt.width-opt.border.width*2-border*2,
				height: opt.height-opt.border.height*2
			}
		}
	});
}

Public.prototype.eventsAdd= function (event) {
	var text=locales[event.name] || event.name;
	if (!this.events.all)
		this.events.all={};
	if (!this.events.all[event.id]){
		var focused;
		if (this.engine.textures.events_list_button_focused)
			focused=new ASprite(getTextureFrames(this.engine.textures.events_list_button_focused));	
		//TODO: check style
		this.events.all[event.id]=this.events.buttons.keyPadAddButton({
			sprite: new ASprite(getTextureFrames(this.engine.textures.events_list_button)), 
			focused: focused,
			text:{
				data: text, 
				position:{x:this.events.buttons.buttonSize.x/2,y:this.events.buttons.buttonSize.y/2},
				anchor:{x:0.5,y:0.45},
				style: {font: 'bold 16px Arial', fill: "#ffffff", stroke: "#000000",strokeThickness:2}
			},
			actions: ['press'],
			pressAction: this.eventsButtonAction
		}); 
	} else {
		this.events.all[event.id].text.setText(text);
	}
	this.events.all[event.id].event=event;
	//TODO: add actions
}

Public.prototype.eventsRemove= function (event) {
	this.events.buttons.keyPadRemoveButton(this.events.all[event.id]);
	delete this.events.all[event.id];
}

//action on press button
Public.prototype.eventsButtonAction= function (event) {
	console.log(this.event);
}

