Types.cnv=document.getElementById('canvas');

Types.draw_map=function (){
	Types.move_map();
//	Types.fps;
}

if (Types.cnv){
	Types.ctx = Types.cnv.getContext('2d');
	Types.shift=30;
	Types.background= Types.canvas_init(Types.shift);
	Types.speed=document.getElementById("tdef_type_npc_params_speed").value || 0;
	Types.position={x:0,y:0}
	Types.direction={x:0,y:0}
	setInterval(Types.draw_map,1000/Types.fps)
	document.getElementById("tdef_type_npc_params_speed").setAttribute("onchange","Types.setSpeed(this.value)")
}

proceedUploadedFile= function (o){
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
	
	Types.images[current_texture]=new Image;
	Types.images[current_texture].src=o.url;
}

var current_texture=0;
var current_texture_name="idle_up";

function switch_texture(obj){
	var current=obj.getAttribute("value");
	document.getElementById("div_"+current).removeAttribute("hidden");
	document.getElementById("li_"+current).setAttribute("class","active");
	
	document.getElementById("div_"+current_texture).setAttribute("hidden","");
	document.getElementById("li_"+current_texture).removeAttribute("class");
	
	current_texture=current;
	
	Types.direction={x:0,y:0};
	current_texture_name=obj.getAttribute("type");
	if (current_texture_name.indexOf("walk") > -1){
		if (current_texture_name.indexOf("up") > -1)
			Types.direction.y=-1;
		if (current_texture_name.indexOf("down") > -1)
			Types.direction.y=1;
		if (current_texture_name.indexOf("left") > -1 || current_texture_name.indexOf("_") == -1)
			Types.direction.x=1;
		if (current_texture_name.indexOf("righ") > -1)
			Types.direction.x=-1;
	}
}
