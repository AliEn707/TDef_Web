Types.cnv=document.getElementById('canvas');
Types.current_frame=0;

Types.draw_map=function (){
	Types.move_map();
	if (Types.images[current_texture]){
		var frame_time=13/Types.fps;
		var current_frame=parseInt(Types.current_frame);
		var frames=parseInt(document.getElementById('tdef_type_npc_textures_'+current_texture_name+'_frames').value);
		var sprite={height:parseInt(document.getElementById('tdef_type_npc_textures_'+current_texture_name+'_height').value),
					width:parseInt(document.getElementById('tdef_type_npc_textures_'+current_texture_name+'_width').value)/frames};
		if (!sprite.height)
			sprite.height=Types.images[current_texture].height;
		if (!sprite.width)
			sprite.width= Types.images[current_texture].width/frames || sprite.height;
		Types.ctx.drawImage(Types.images[current_texture],current_frame*sprite.width,0,sprite.width,sprite.height,Types.cnv.height/4,Types.cnv.width/4,Types.cnv.height/2,Types.cnv.width/2)
		
		Types.current_frame+=frame_time;
		if (Types.current_frame>=frames)
			Types.current_frame=0;
	}
}

if (Types.cnv){
	Types.ctx = Types.cnv.getContext('2d');
	Types.shift=30;
	Types.background= Types.canvas_init(Types.shift);
	Types.position={x:0,y:0}
	Types.direction={x:0,y:0}
	setInterval(Types.draw_map,1000/Types.fps)
	Types.speed=document.getElementById("tdef_type_npc_params_speed").value
	document.getElementById("tdef_type_npc_params_speed").setAttribute("onchange","Types.setSpeed(this.value)")
}

proceedUploadedFile= function (o){
	Types.images[current_texture]=new Image;
	Types.images[current_texture].onload = function(){document.getElementById('tdef_type_npc_textures_'+current_texture_name+'_height').value=Types.images[current_texture].height}
	Types.images[current_texture].src=o.url;
	
	var input=document.getElementById("img_"+current_texture);
	if (!input){
		input=document.createElement("input");
		input.setAttribute("id","img_"+current_texture);
		input.setAttribute("type","hidden");
		input.setAttribute("name","tdef_type_npc[textures]["+current_texture_name+"][img]");
		input.setAttribute("form",form);
		document.body.appendChild(input);
	}
	input.setAttribute("value",o.id);
}

var current_texture=0;
var current_texture_name="idle_up";

function switch_texture(obj){
	var current=obj.getAttribute("value");
	
	document.getElementById("div_"+current_texture).setAttribute("hidden","");
	document.getElementById("li_"+current_texture).removeAttribute("class");
	
	document.getElementById("div_"+current).removeAttribute("hidden");
	document.getElementById("li_"+current).setAttribute("class","active");
	
	current_texture=current;
	
	Types.direction={x:0,y:0};
	current_texture_name=obj.getAttribute("type");
	if (current_texture_name.indexOf("walk") > -1){
		if (current_texture_name.indexOf("up") > -1)
			Types.direction.y=1;
		if (current_texture_name.indexOf("down") > -1)
			Types.direction.y=-1;
		if (current_texture_name.indexOf("left") > -1 || current_texture_name.indexOf("_") == -1)
			Types.direction.x=1;
		if (current_texture_name.indexOf("righ") > -1)
			Types.direction.x=-1;
	}
	Types.current_frame=0;
	if (Types.images[current_texture])
		document.getElementById("image_size").innerHTML=Types.images[current_texture].height+"x"+Types.images[current_texture].width;
	else
		document.getElementById("image_size").innerHTML=""
}
