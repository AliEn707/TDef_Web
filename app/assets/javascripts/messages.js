//script path Routes.message_path(id)+"?type="+type

var Messages={};
	
Messages.load=function (){
	var str=route;
	if (timestamp)
		str+="&from="+timestamp;
	loadScript(str);
}

Messages.loadOld=function (){
	addMessages=Messages.addOld;
	Messages.load();
}

Messages.loadNew=function (){
	addMessages=Messages.addNew;
	Messages.load();
}

Messages.addOld=function (){
	//add old messages
}

Messages.addNew=function (){
	document.getElementById("messages_area").innerHTML+=messages;
}
Messages.clearArea=function (){
	document.getElementById("message_data").value="";
}

var addMessages; //alias for functions for loading messages

Messages.loadNew();
setInterval(Messages.loadNew, 3000);