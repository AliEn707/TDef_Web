

function toggle_qrdiv(){
	var obj=document.getElementById("qrdiv")
	if (obj.childElementCount==0){
		var img=document.createElement("img")
		img.setAttribute("src",qrcode_src)
		obj.appendChild(img)
	}
	var attr=obj.getAttribute("hidden")
	if (attr==null){
		obj.setAttribute("hidden","")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-up")
	}else{
		obj.removeAttribute("hidden")
		obj.parentNode.getElementsByTagName("arrow")[0].setAttribute("class","icon-arrow-down")
	}
}