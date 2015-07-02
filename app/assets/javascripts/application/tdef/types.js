Types={}
Types.fps=20;
Types.lines=12;	
Types.images={};

Types.canvas_init =function (shift){
	var lines=Types.lines
	cnv=document.createElement('canvas');
	cnv.height=shift*lines;
	cnv.width=shift*lines;
	ctx = cnv.getContext('2d');
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	ctx.strokeStyle = "#000000";
	for(var i=0;i<lines;i++){
		ctx.beginPath();
		ctx.moveTo(0, shift*i);
		ctx.lineTo(cnv.height, shift*i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(shift*i, 0);
		ctx.lineTo(shift*i,cnv.width);
		ctx.stroke();
	}
	return cnv;
}


Types.move_map=function (){
	var style=window.getComputedStyle(Types.cnv)
	style={width: parseInt(style.width),height: parseInt(style.height)}
	var length=Math.sqrt(Types.direction.x*Types.direction.x+Types.direction.y*Types.direction.y)
	var scale=(style.width)/Types.background.width;
	var shift=Types.shift*scale;
	var size={width:Types.background.width*scale,height:Types.background.height*scale}
	var speed=Types.speed*Types.lines/2//node map containe 4 nodes
	Types.cnv.width=style.width
	Types.cnv.height=style.height
//	console.log(Types.position)
	if (length){
		Types.position.x+=Types.direction.x*speed*shift/Types.fps/length;
		Types.position.y+=Types.direction.y*speed*shift/Types.fps/length;
	}
	if (Types.position.x<0)
		Types.position.x=shift;
	if (Types.position.x>shift)
		Types.position.x=0;
	if (Types.position.y>shift)
		Types.position.y=0;
	if (Types.position.y<0)
		Types.position.y=shift;
	Types.ctx.drawImage(Types.background,Types.position.x-shift,Types.position.y-shift,size.height+shift,size.width+shift)
}

Types.draw_map=function (){
	Types.move_map();
	if (Types.images[current_texture]){
		var frame_time=13/Types.fps;
		var current_frame=parseInt(Types.current_frame);
		var frames=parseInt(document.getElementById(current_type+'_textures_'+current_texture_name+'_frames').value);
		var sprite={height:parseInt(document.getElementById(current_type+'_textures_'+current_texture_name+'_height').value),
					width:parseInt(document.getElementById(current_type+'_textures_'+current_texture_name+'_width').value)/frames};
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

Types.setSpeed= function (s){
	Types.speed=s;
}

Types.switch_texture= function(obj){
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

Types.proceed_uploaded_texture=function (o){
	Types.images[current_texture]=new Image;
	Types.images[current_texture].onload = function(){
										document.getElementById(current_type+'_textures_'+current_texture_name+'_height').value=Types.images[current_texture].height;
										document.getElementById(current_type+'_textures_'+current_texture_name+'_frames').value=Types.images[current_texture].width/Types.images[current_texture].height;
									}
	Types.images[current_texture].src=o.url;
	
	var input=document.getElementById("img_"+current_texture);
	if (!input){
		input=document.createElement("input");
		input.setAttribute("id","img_"+current_texture);
		input.setAttribute("type","hidden");
		input.setAttribute("name",current_type+"[textures]["+current_texture_name+"][img]");
		input.setAttribute("form",form);
		document.body.appendChild(input);
	}
	input.setAttribute("value",o.id);
}