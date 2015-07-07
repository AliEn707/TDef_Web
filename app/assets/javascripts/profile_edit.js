function proceedUploadedFile(obj){
	console.log(obj)
	var img= new Image;
	img.src=obj.url;
	document.getElementById("image_div").innerHTML="";
	document.getElementById("image_div").appendChild(img);
	
	var old=document.createElement("input");
	old.type="hidden";
	old.name="old_images[]";
	old.value=current_image_id;
	document.getElementById("old_images").appendChild(old);
	
	current_image_id=obj.id;
}
