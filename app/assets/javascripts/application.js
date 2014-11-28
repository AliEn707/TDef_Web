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
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require bootstrap
//= require turbolinks
//= require_tree .

qrdata=[]

function qrcode(){
	if (qrdata.length==0)
		return
	var canvas = document.getElementById("qrcode")
	if (typeof(canvas)=='undefined')
		return
	var ctx = canvas.getContext('2d')
	size=qrdata.length
	stride=2
	ctx.canvas.width = size*stride
	ctx.canvas.height = size*stride
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)
	ctx.fillStyle= "#ffffff"
	for (i=0;i<size;i++)
		for (j=0;j<size;j++)
			if (qrdata[i][j]=='0')
				ctx.fillRect(i*stride,j*stride,stride,stride)
}

function toggle_qrdiv(){
	obj=document.getElementById("qrdiv")
	attr=obj.getAttribute("hidden")
	if (attr==null){
		obj.setAttribute("hidden","")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-up")
	}else{
		obj.removeAttribute("hidden")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-down")
	}
}


