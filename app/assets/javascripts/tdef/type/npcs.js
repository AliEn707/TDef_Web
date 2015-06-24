Types.cnv=document.getElementById('canvas');
if (Types.cnv){
	Types.ctx = Types.cnv.getContext('2d');
	Types.shift=30;
	Types.background= Types.canvas_init(Types.shift);
	Types.speed=document.getElementById("tdef_type_npc_params_speed").value || 0;
	Types.position={x:0,y:0}
	Types.direction={x:0,y:0}
	setInterval(Types.move_map,100/2)
	document.getElementById("tdef_type_npc_params_speed").setAttribute("onchange","Types.setSpeed(this.value)")
}

var proceedUploadedFile = function (obj){
	alert("file loaded")
}

var current_texture=0
var current_texture_name
function switch_texture(obj){
	var current=obj.getAttribute("value")
	document.getElementById("div_"+current).removeAttribute("hidden")
	document.getElementById("li_"+current).setAttribute("class","active")
	
	document.getElementById("div_"+current_texture).setAttribute("hidden","")
	document.getElementById("li_"+current_texture).removeAttribute("class")
	
	current_texture=current;
	
	Types.direction={x:0,y:0}
	current_texture_name=obj.getAttribute("type")
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