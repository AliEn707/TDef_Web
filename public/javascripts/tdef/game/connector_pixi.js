
var jsReady = false;

var connectorReady; //function in future

var latency;

//rename to proceedReceivedData
function mapGotObject(str){
	var obj=eval(str);
	delete str;
	var e=getEngine();
	if (obj.objtype=="Player"){
		//player
		
	}else//{
		if (obj.objtype=="Npc"){
		if (!e.mapObjects[obj.id]){
			e.mapObjects[obj.id]=eval("new "+obj.objtype+"(obj)");
			e.stage.addChild(e.mapObjects[obj.id]);
		}
		if (e.mapObjects[obj.id]){
			e.mapObjects[obj.id].update(obj);
		}
	}
	//console.log(str)
}

function mapAuthData(str){
	var obj=eval(str);
}

function isReady() {
        return jsReady;
}

function getConnector() {
	movieName="connector";
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}

//map network funtions
function mapConnect(host,port) {
	getConnector().mapConnect(host,port);
}


function mapAuthData(value) {
//	console.log(value);
	sendToJavaScript(value)
	var obj=eval(value)
	latency=obj.latency*6/100;
	if (latency==0)
		latency=2;
}

function connectorReady(){
	console.log("Connector ready");
	hideConnector(getConnector());
}

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

