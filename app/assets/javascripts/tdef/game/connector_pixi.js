
var jsReady = false;

var hideConnector; //function in future

var latency;

function isReady() {
        return jsReady;
}

//get connector object to call functions
function getConnector() {
	movieName="connector";
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}

///map network funtions

var MSG_SPAWN_TOWER=1;
var MSG_SPAWN_NPC=2;
var MSG_DROP_TOWER=3;
var MSG_MOVE_HERO=4;
var MSG_SET_TARGET=5;
//send to mapserver; 
//str is string of pairs of params type,data,...
//types: byte char short int uint float string
//note: string only send string of bytes
function mapSend(str) {
	getConnector().mapSend(str);
	//for spawn npc must be "byte,"+MSG_SPAWN_NPC+",int,"+num
}

//spawn Npc
function mapSpawnNpc(num){
	mapSend("byte,"+MSG_SPAWN_NPC+",int,"+num);
}

//spawn Tower
function mapSpawnTower(num, node){
	mapSend("byte,"+MSG_SPAWN_TOWER+",int,"+node+",short,"+num);
}

//move Hero
function mapMoveHero(node){
	mapSend("byte,"+MSG_MOVE_HERO+",int,"+node);
}

//connect to mapserver
function mapConnect(host,port) {
	getConnector().mapConnect(host,port);
}

//callback if cant connect
function mapConnectionError(val){
	console.log("can't connect: "+val);
	//TODO add handler
}

//callback on map auth
function mapAuthData(value) {
//	console.log(value);
	sendToJavaScript(value)
	var obj=eval(value)
	latency=obj.latency*6/100;
	if (latency==0)
		latency=2;
}

//callback on got objects data
function proceedReceivedData(str){
	var arr=eval(str);
	delete str;
	var e=getEngine();
	for(var i in arr){
		var obj=arr[i];
		if (obj.objtype){
			if (obj.objtype=="Player"){
				//player
				
			}else{
				if (!e.mapObjects[obj.id]){
					e.mapObjects[obj.id]=eval("new "+obj.objtype+"(obj)");
					e.stage.addChild(e.mapObjects[obj.id]);
				}
				if (e.mapObjects[obj.id]){
					e.mapObjects[obj.id].update(obj);
				}
			}
		}else{
			console.log(obj)
		}
		//console.log(str)
	}
}

//callback on connector initialising
function connectorReady(){
	console.log("Connector ready");
	hideConnector(getConnector());
}

///functions for adding connectors

//adding Flash connector to page
function addConnectorSWF(place) {
	var width=500
	var obj = document.createElement('object')
	obj.setAttribute('classid', 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000')
	obj.setAttribute('id', 'connector')
	obj.setAttribute('width', width)
	obj.setAttribute('height', '375')
	obj.setAttribute('codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab')
	var param = document.createElement('param')
	param.setAttribute('name', 'movie')
	param.setAttribute('value', 'connector')
	obj.appendChild(param)
	param = document.createElement('param')
	param.setAttribute('name', 'quality')
	param.setAttribute('value', 'high')
	obj.appendChild(param)
	param = document.createElement('param')
	param.setAttribute('name', 'bgcolor')
	param.setAttribute('value', '#869ca7')
	obj.appendChild(param)	
	param = document.createElement('param')
	param.setAttribute('name', 'allowScriptAccess')
	param.setAttribute('value', 'sameDomain')
	obj.appendChild(param)
	var embed = document.createElement('embed')
	embed.setAttribute('src', '/javascripts/tdef/game/connector.swf')
	embed.setAttribute('quality', 'high')
	embed.setAttribute('bgcolor', '#869ca7')
	embed.setAttribute('width', '500')
	embed.setAttribute('height', '375')
	embed.setAttribute('name', 'connector')
	embed.setAttribute('align', 'middle')
	embed.setAttribute('play', 'true')
	embed.setAttribute('loop', 'false')
	embed.setAttribute('quality', 'high')
	embed.setAttribute('type', 'application/x-shockwave-flash')
	embed.setAttribute('pluginspage', 'http://www.macromedia.com/go/getflashplayer')
	obj.appendChild(embed)
	
	obj.style.zIndex=0
	obj.style.position="absolute"
	obj.style.left=0//-width
	obj.style.top="0"
//	obj.setAttribute("hidden","")
	
	place=place || document.body
	place.appendChild(obj)
	
	hideConnector=function (obj){
		obj.parentNode.style.left=-obj.width+"px";
	}
}

