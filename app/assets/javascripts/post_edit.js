function proceedUploadedFile(obj){
//	console.log(obj)
	var div=document.createElement("div")
	div.setAttribute("style","display: inline-block;position:relative;");
	var img=new Image();
	img.id="img_"+obj.id;
	img.setAttribute("class","img-polaroid");
	img.setAttribute("onload","setImgSize(this)");
	img.src=obj.url;
	div.appendChild(img);
	
	var hide=document.createElement("input")
	hide.type="hidden"
	hide.id="hide_"+img.id
	hide.value=img.src
	div.appendChild(hide);
	
	var button=document.createElement("button");
	button.setAttribute("data-clipboard-target",hide.id);
	button.setAttribute("class","uk-button-core btn-inverse uk-button-large");
	button.setAttribute("style","position:absolute;left:0px;bottom:0px;");
	button.id="button_"+img.id;
	button.innerHTML='<i class="icon-link"> </i>'
	div.appendChild(button);
	var del=document.createElement("button");
	del.setAttribute("data",obj.id);
	del.setAttribute("onclick","removePostImg(this)");
	del.setAttribute("class","uk-button-core btn-danger uk-button-large");
	del.setAttribute("style","position:absolute;right:0px;top:0px;");
	del.innerHTML='<i class="icon-remove"> </i>'
	div.appendChild(del);
	
	document.getElementById("images").appendChild(div);
	var clip = new ZeroClipboard($("#"+button.id))
	
	var hide=document.createElement("input")
	hide.type="hidden"
	hide.id="hide_"+obj.id
	hide.value=obj.id
	hide.name="img_ids[]"
	document.getElementById("ids_div").appendChild(hide);
}

function removePostImg(obj){
	var id=obj.getAttribute("data")
	obj.parentNode.parentNode.removeChild(obj.parentNode)
	console.log(id)
	obj=document.getElementById("hide_"+id)
	obj.parentNode.removeChild(obj)
	
}

function setImgSize(obj){
	obj.setAttribute("title",obj.width+"x"+obj.height)
	obj.setAttribute("width",200)
	obj.setAttribute("height",200)
	obj.removeAttribute("onload")
}