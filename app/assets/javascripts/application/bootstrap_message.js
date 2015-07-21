function bootstrapFlash(str,type){
	var flash_type="success";
	if (type=="alert")
		flash_type="error";
	var div=document.createElement("div");
	div.innerHTML='<button class="close" data-dismiss="alert">×</button>'+str;
	div.setAttribute("class","alert fade in alert-"+flash_type);
	document.getElementById("bootstrap_flash").appendChild(div);
}					