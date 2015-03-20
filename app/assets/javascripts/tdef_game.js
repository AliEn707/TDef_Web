// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require ./tdef/game/pixi.dev.js
//= require ./tdef/game/asprite_pixi.js
//= require ./tdef/game/atilingsprite_pixi.js
//= require ./tdef/game/wall_pixi.js
//= require ./tdef/game/tilemap_pixi.js
//= require ./tdef/game/engine_pixi.js
//= require ./tdef/game/player_pixi.js
//= require ./tdef/game/npc_pixi.js
//= require ./tdef/game/bullet_pixi.js
//= require ./tdef/game/tower_pixi.js
//= require ./tdef/game/connector_pixi.js
//= require ./tdef/game/test_pixi.js



function toggle_qrdiv(){
	obj=document.getElementById("qrdiv")
	attr=obj.getAttribute("hidden")
	if (attr==null){
		document.cookie="qrcode=t"
		obj.setAttribute("hidden","")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-up")
	}else{
		document.cookie="qrcode=f"
		obj.removeAttribute("hidden")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-down")
	}
}


