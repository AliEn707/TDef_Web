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
//= require jquery.remotipart
//= require jquery.flot
//= require zeroclipboard
//= require twitter/bootstrap
//= require bootstrap
//= require js-routes
//= require PluginDetect
//= require_tree ./application



function setSubmission(){
	if (!window.onbeforeunload)
		window.onbeforeunload=function (){return " "};
}

function removeSubmission(){
	window.onbeforeunload=undefined;
}

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};


//load JavaScript via AJAX on in common way
function loadScript(src, as_tag){
	if (as_tag){
		var s=document.createElement("script");
		s.src=src;
		document.body.appendChild(s);
	}else{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', src, true);
		xmlhttp.setRequestHeader("Accept","*/*");
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				eval(xmlhttp.responseText);
			}
		};
		xmlhttp.send();
	}
}

function afterWindowLoad(f){
	if (window.addEventListener)
		window.addEventListener("load", f, false);
	else if (window.attachEvent)
		window.attachEvent("onload", f);
	else window.onload = f;
}