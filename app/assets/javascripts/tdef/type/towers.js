Types.cnv=document.getElementById('canvas');
Types.current_frame=0;

var proceedUploadedFile;

var current_type="tdef_type_tower";

var current_texture=0;
var current_texture_name="idle_up";

var switch_texture=Types.switch_texture;

if (Types.cnv){
	Types.ctx = Types.cnv.getContext('2d');
	Types.shift=30;
	Types.background= Types.canvas_init(Types.shift);
	Types.position={x:0,y:0}
	Types.direction={x:0,y:0}
	setInterval(Types.draw_map,1000/Types.fps)
}


