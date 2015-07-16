//script path Routes.message_path(id)+"?type="+type

var Messages={};
	
Messages.load=function (){
	var str=Routes.message_path(id)+"?type="+type;
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

var addMessages; //alias for functions for loading messages

Messages.loadNew();
setInterval(Messages.loadNew, 3000);