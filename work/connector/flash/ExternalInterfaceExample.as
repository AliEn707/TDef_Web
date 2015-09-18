//on server manager need to add listener on port 843, for sending private pollicy file
package {
    import flash.system.Security
    import flash.display.Sprite;
    import flash.events.*;
    import flash.external.ExternalInterface;
    import flash.text.TextField;
    import flash.utils.Timer;
    import flash.utils.Endian;
    import flash.text.TextFieldType;
    import flash.text.TextFieldAutoSize;
	
    import flash.net.Socket;
    import flash.errors.*;

    public class ExternalInterfaceExample extends Sprite {
        private var input:TextField;
        private var output:TextField;
        private var sendBtn:Sprite;
	private var isReady:Boolean=false;

	private var mapSock:Socket = new Socket();
	private var publicSock:Socket = new Socket();
	private var dataTimer:Timer = new Timer(160, 0);//40, 0);
	private var publicTimer:Timer = new Timer(190, 0);//40, 0);
	private var date:Date = new Date();
	
        public function ExternalInterfaceExample() {
		Security.allowDomain("*");
		Security.allowInsecureDomain("*");
		input = new TextField();
		input.type = TextFieldType.INPUT;
		input.background = true;
		input.border = true;
		input.width = 350;
		input.height = 18;
		addChild(input);

		sendBtn = new Sprite();
		sendBtn.mouseEnabled = true;
		sendBtn.x = input.width + 10;
		sendBtn.graphics.beginFill(0xCCCCCC);
		sendBtn.graphics.drawRoundRect(0, 0, 80, 18, 10, 10);
		sendBtn.graphics.endFill();
		sendBtn.addEventListener(MouseEvent.CLICK, clickHandler);
		addChild(sendBtn);

		output = new TextField();
		output.y = 25;
		output.width = 450;
		output.height = 325;
		output.multiline = true;
		output.wordWrap = true;
		output.border = true;
		output.text = "Initializing...\n";
		addChild(output);
	
		if (ExternalInterface.available) {
			try {
				if (checkJavaScriptReady()) {
					output.appendText("JavaScript is ready.\n");
					setupCallBacks()
				} else {
					output.appendText("JavaScript is not ready, creating timer.\n");
					var readyTimer:Timer = new Timer(100, 0);
					readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);
					readyTimer.start();
				}
			} catch (error:SecurityError) {
				output.appendText("A SecurityError occurred: " + error.message + "\n");
			} catch (error:Error) {
				output.appendText("An Error occurred: " + error.message + "\n");
			}
		} else {
			output.appendText("External interface is not available for this container.");
		}
        }
	
        private function setupCallBacks():void {
		output.appendText("Adding callback...\n");
		ExternalInterface.addCallback("sendToActionScript", receivedFromJavaScript);
                ExternalInterface.addCallback("mapConnect", connectMap);
                ExternalInterface.addCallback("mapClose", closeMap);
                ExternalInterface.addCallback("mapSend", sendMap);
                ExternalInterface.addCallback("publicConnect", connectPublic);
                ExternalInterface.addCallback("publicSend", sendPublic);
//                ExternalInterface.addCallback("startMap", startMap);
		isReady = true;
		ExternalInterface.call("connectorReady");
		//add javascript info about init flash
	}

        private function timerHandler(event:TimerEvent):void {
		output.appendText("Checking JavaScript status...\n");
		if (checkJavaScriptReady()) {
			setupCallBacks();
			output.appendText("JavaScript is ready.\n");
			Timer(event.target).stop();
		}
        }
	
        private function receivedFromJavaScript(value:String):void {
		output.appendText("JavaScript says: " + value + "\n");
        }
	
        private function logJS(value:String):void {
		if (isReady) {
			ExternalInterface.call("sendToJavaScript", value);
		}
	}
	
        private function checkJavaScriptReady():Boolean {
            var R:Boolean = ExternalInterface.call("isReady");
            return R;
        }
	
        private function clickHandler(event:MouseEvent):void {
		logJS(input.text);
        }
	
	///Sockets
	
	//bit constants
	private const BIT_1:int= 1;
	private const BIT_2:int= 2;
	private const BIT_3:int= 4;
	private const BIT_4:int= 8;
	private const BIT_5:int= 16;
	private const BIT_6:int= 32;
	private const BIT_7:int= 64;
	private const BIT_8:int= 128;
	private const BIT_9:int= 256;
	private const BIT_10:int= 512;
	private const BIT_11:int= 1024;
	private const BIT_12:int= 2048;
	private const BIT_13:int= 4096;
	private const BIT_14:int= 8192;
	private const BIT_15:int= 16384;
	private const BIT_16:int= 32768;
	private const BIT_17:int= 65536;
	private const BIT_18:int= 131072;
	private const BIT_19:int= 262144;
	private const BIT_20:int= 524288;
	private const BIT_21:int= 1048576;
	private const BIT_22:int= 2097152;
	private const BIT_23:int= 4194304;
	private const BIT_24:int= 8388608;
	private const BIT_25:int= 16777216;
	private const BIT_26:int= 33554432;
	private const BIT_27:int= 67108864;
	private const BIT_28:int= 134217728;
	private const BIT_29:int= 268435456;
	private const BIT_30:int= 536870912;
	private const BIT_31:int= 1073741824;
//	private const BIT_32:uint= 2147483648;

	
	private function sendSocket(sock:Socket,value:String):int {
		var arr:Array;
		arr=value.split(",");
		try{
			while(arr.length>1){
				switch (arr.shift()){
					case "byte":
					case "char":
						sock.writeByte(int(arr.shift()));
						break;
					case "short":
						sock.writeShort(int(arr.shift()));
						break;
					case "int":
						sock.writeInt(int(arr.shift()));
						break;
					case "uint":
						sock.writeUnsignedInt(uint(arr.shift()));
						break;
					case "float":
						sock.writeFloat(Number(arr.shift()));
						break;
					case "double":
						sock.writeDouble(Number(arr.shift()));
						break;
					case "string":
						sock.writeUTF(arr.shift());
						break;
				}
			}
		}
		catch (error:Error){
			return 1;
		}
		sock.flush();
		return 0;
	}
	
	///public
///--------------------------------------------------------------------------------------------------------
	
	//bitmasks
	private var BM_EVENT_MAP_NAME:int= BIT_1;
	
	private var BM_PLAYER_ROOM:int= BIT_3; 
	//out message types
	private var MESSAGE_PLAYER_CHANGE:int= 1;
	private var MESSAGE_EVENT_CHANGE:int= 2;
	private var MESSAGE_GAME_START:int= 3;
	//
	private var MESSAGE_CREATED:int= 2;
	private var MESSAGE_CHANGED:int= 2;
	private var MESSAGE_DELETED:int= 2;
	
	private var publicAuthorised:Boolean=false;
	private var publicMsg:int;
	private var publicDataSeq:Array = new Array();
	private var publicOutObj:String = "({";
	
	private function publicConnectError(value:String):void {
		if (isReady) {
			ExternalInterface.call("publicConnectionError", value);
		}
	}
	private var user:String;
	private var token:int;
	private var user_id:int=0;
	
	private function sendPublic(value:String):int {
		if (publicAuthorised){
			return sendSocket(publicSock,value);
		}
		return 0;
	}
	
	private function publicConnected(s:String):void {
		if (isReady) {
			ExternalInterface.call("publicConnected",s);
		}
	}
		
	private function connectPublic(host:String, port:String, u:String, p:String):int {
	        logJS("Try to connect\n");
		output.appendText(host+" "+port+"\n");
		user=u;
		token=int(p);
		publicSock= new Socket();
		publicSock.endian = Endian.LITTLE_ENDIAN;
		publicSock.addEventListener(Event.CONNECT, publicConnectHandler); 
		publicSock.addEventListener(Event.CLOSE, publicConnectCloseHandler); 
		publicSock.addEventListener(ErrorEvent.ERROR, publicConnectErrorHandler); 
		publicSock.addEventListener(IOErrorEvent.IO_ERROR, publicConnectIoErrorHandler); 
		publicSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, publicConnectSecurityErrorHandler);
		
		publicMsg=0;
		
		try {
			publicSock.connect(host, int(port));
		}
		catch (error:Error) {
			logJS("An Error occurred: " + error.message + "\n");
		}
		catch (error:SecurityError) {
			logJS("An SecurityError occurred: " + error.message + "\n");
		}
		catch (error:IOError) {
			logJS("An IO Error occurred: " + error.message + "\n");
		}
		return 0;
        }
	
	private function publicConnectErrorHandler(event:ErrorEvent):void {
		logJS("got Error" + event);
		publicConnectError("Error");
	}
	
	private function publicConnectIoErrorHandler(event:IOErrorEvent):void {
		logJS("got IOError"+event);
		publicConnectError("IOError");
	}
	
	private function publicConnectSecurityErrorHandler(event:SecurityErrorEvent):void {
		logJS("got SecurityError"+event);
		publicConnectError("SecurityError");
	}
	
	private function publicConnectHandler(event:Event):void {
		logJS("connected " + event+"\n");
		//send hello
		publicSock.writeUTFBytes("FlashHello^_^");
		publicSock.flush();
		//add data listener
		publicSock.addEventListener(ProgressEvent.SOCKET_DATA, publicDataHandler); 
		//check messages by timer, if no additional data
		
		publicTimer.addEventListener(TimerEvent.TIMER, publicTimeDataHandler);
		publicTimer.start();
		publicMsg=0;
	}
	
  	private function publicConnectCloseHandler(event:Event):void {
		logJS("closed" + event+"\n");
		publicAuthFail();
		publicAuthorised=false;
		publicTimer.removeEventListener(TimerEvent.TIMER, publicTimeDataHandler);
		publicTimer.stop();
		publicAuthFail();
	}
	
	//time event wrapper for data handler
	private function publicTimeDataHandler(event:TimerEvent):void {
//		logJS("got timer data" + event+"\n");
		if (publicSock.bytesAvailable>0){
			var pevent:ProgressEvent;
			publicDataHandler(pevent);
		}
	}
	
	//when socket has data
	private function publicDataHandler(event:ProgressEvent):void {
//		logJS("got data" + event+"\n");
		if (publicAuthorised){
			publicGetMessage();
//			logJS("got data " + mapSock.readUTFBytes(mapSock.bytesAvailable));
		}else{
			publicAuth();
		}
	}
	
	private function publicAuthFail():void {
		ExternalInterface.call("publicAuthFail");
	}
	
	private function publicAuth():void {
		var id:int;
		var timestamp:Number;
		var loop:Boolean=true;
		switch (publicMsg){
			case 0:
				try{
					id=publicSock.readInt();
					publicSock.writeInt(user.length);
					publicSock.writeUTFBytes(user);
					publicSock.writeInt(token);
					publicSock.flush();
					publicMsg++;
					logJS("got "+id);
				}
				catch(error:Error){
//					logJS("id error"+error+"\n");
				}
				break;
			case 1:
				try{
					id=publicSock.readInt();
					publicMsg++;
					logJS("id: "+id);
					publicOutObj+="id: "+id+",";
					if (id==0){
						publicSock.close();
						publicAuthFail();
						var event:Event;
						publicConnectCloseHandler(event);//clear handlers
					}
				}
				catch(error:Error){
//					logJS("players error"+error+"\n");
				}
				break;
			case 2:
				try{
					timestamp=publicSock.readDouble();
					publicMsg++;
					logJS("time: "+timestamp);
					publicOutObj+="time:"+timestamp+",";
					publicAuthorised=true;
					publicConnected(publicOutObj+"})");
					publicOutObj="([";
				}
				catch(error:Error){
//					logJS("players error"+error+"\n");
				}
				break;
		}
	}
	
	private function proceedPublicMessagesJS(value:String):void {
		if (isReady) {
			ExternalInterface.call("proceedPublicMessages", value);
		}
	}
	
	private var publicMsgTime:int=0;
	
	private function publicGetMessage():void {
		var data:Number;
		var str:String;
		do {
//			logJS(publicDataSeq+" || "+publicDataSeq[0]);
			try{
				switch (publicDataSeq[0]){
					case undefined: //lets see for next message
//						logJS("new message");
						if (publicOutObj.length>2){//send object to javasctript
						        var time:int=flash.utils.getTimer();
						        publicOutObj+=",time:"+time+"},";
						        if (time-publicMsgTime>70){
								proceedPublicMessagesJS(publicOutObj+"])");
								publicOutObj="([";
								publicMsgTime=time;
							}
						}
						publicMsg=publicSock.readByte();
						if (publicMsg!=0){
							publicDataSeq.push("bitmask");
							publicOutObj+="{msg:"+publicMsg;
						}
						break;
					
					case "bitmask": //need to get bitmask
//						logJS("get bitmask");

						var bitMask:int;
						bitMask=publicSock.readInt();
						publicDataSeq.shift();
						publicGetParamsByBitMask(bitMask);
						
						break;
						
					default:
//						logJS(publicOutObj);
//						logJS("get "+publicDataSeq[1]);
						switch (publicDataSeq[1]){
							case "{":
								str="{$:0";
								break;
							case "}":
								publicOutObj+="}";
							case "none":
							case "nil":
							case "null":
								str="0";
								break;
							case "int":
								data=publicSock.readInt();
								str=data+""
								break;						
							case "short":
								data=publicSock.readShort();
								str=data+""
								break;						
							case "byte":
							case "char":
								data=publicSock.readByte();
								str=data+""
								break;						
							case "float":
								data=publicSock.readFloat();
								str=data+""
								break;
							case "double":
								data=publicSock.readDouble();
								str=data+""
								break;
							case "string": //we have short: sizeof string than string  in socket
								str="\""+publicSock.readUTF()+"\"";
//								publicDataSeq.splice(2,1);
//								break;
						}
						publicOutObj+=","+publicDataSeq[0]+":"+str;
						publicDataSeq.shift();
						publicDataSeq.shift();
//						publicDataSeq.splice(0,2);
						
						break;
						
				}
			}
			catch (error:Error){
				logJS(""+error);
				return;
			}
//			logJS("step");
		} while(publicSock.bytesAvailable>0);
	}
	
	private function publicGetParamsByBitMask(bitMask:int):void{
		var i:int;
		//here must be list of getting obj params 
		switch (publicMsg){
			case MESSAGE_EVENT_CHANGE:
				publicOutObj+=",objtype:\"Event\",action:\"change\"";
				publicOutObj+=",id:"+bitMask;
//				publicDataSeq.push("id","int");
//				publicDataSeq.push("rooms","int");
//				if ((bitMask&BM_EVENT_MAP_NAME)!=0) {
				publicDataSeq.push("map","string");
				publicDataSeq.push("name","string");
//				}
				return;
			case MESSAGE_PLAYER_CHANGE:
//				logJS("MESSAGE_PLAYER_CHANGE");
				publicOutObj+=",objtype:\"Player\"";
				publicDataSeq.push("id","int");
				if ((bitMask&BM_PLAYER_ROOM)!=0){
					logJS("BM_PLAYER_ROOM");
					publicDataSeq.push("room","{");
					publicDataSeq.push("type","int");
					publicDataSeq.push("id","int");
					publicDataSeq.push("$","}");
				}
				return;
			case MESSAGE_GAME_START:
				publicOutObj+=",objtype:\"Room\",action:\"ready\"";
				publicOutObj+=",event_id:"+bitMask;
				publicDataSeq.push("host","string");
				publicDataSeq.push("port","int");
//				if (bitMask)
				return;
			default:
				logJS("unnown public message");
				break;
		}
	}
///------------------------------------------------------------------------------------------------------	
	///map
	private var mapAuthorised:Boolean=false;
	
	private function mapConnectError(value:String):void {
		if (isReady) {
			ExternalInterface.call("mapConnectionError", value);
		}
	}
	
	private function closeMap(host:String, port:String):void {
		mapSock.close();
		var event:Event;
		mapConnectCloseHandler(event);
	}
	
	private function mapConnected():void {
		if (isReady) {
			ExternalInterface.call("mapConnected");
		}
	}
	
	private function mapClosed():void {
		if (isReady) {
			ExternalInterface.call("mapClosed");
		}
	}
	
	private function connectMap(host:String, port:String):int {
	        logJS("Try to connect\n");
		output.appendText(host+" "+port+"\n");
		
		mapSock= new Socket();
		mapSock.endian = Endian.LITTLE_ENDIAN;
		mapSock.addEventListener(Event.CONNECT, mapConnectHandler); 
		mapSock.addEventListener(Event.CLOSE, mapConnectCloseHandler); 
		mapSock.addEventListener(ErrorEvent.ERROR, mapConnectErrorHandler); 
		mapSock.addEventListener(IOErrorEvent.IO_ERROR, mapConnectIoErrorHandler); 
		mapSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, mapConnectSecurityErrorHandler);
		
		currMsg=0;
		
		try {
			mapSock.connect(host, int(port));
//			mapSock.connect("smtp.yandex.ru", 25);
		}
		catch (error:Error) {
			logJS("An Error occurred: " + error.message + "\n");
		}
		catch (error:SecurityError) {
			logJS("An SecurityError occurred: " + error.message + "\n");
		}
		catch (error:IOError) {
			logJS("An IO Error occurred: " + error.message + "\n");
		}
		return 0;
        }
	
	private function mapConnectErrorHandler(event:ErrorEvent):void {
		logJS("got Error" + event);
		mapConnectError("Error");
	}
	
	private function mapConnectIoErrorHandler(event:IOErrorEvent):void {
		logJS("got IOError"+event);
		mapConnectError("IOError");
	}
	
	private function mapConnectSecurityErrorHandler(event:SecurityErrorEvent):void {
		logJS("got SecurityError"+event);
		mapConnectError("SecurityError");
	}
	
	//time event wrapper for data handler
	private function mapTimeDataHandler(event:TimerEvent):void {
//		logJS("got timer data" + event+"  bytes"+mapSock.bytesAvailable);
		if (mapSock.bytesAvailable>0){
			var pevent:ProgressEvent;
			mapDataHandler(pevent);
		}
	}
	//when socket has data
	private function mapDataHandler(event:ProgressEvent):void {
//		logJS("got data" + event+"\n");
		if (mapAuthorised){
			mapGetMessage();
//			logJS("got data " + mapSock.readUTFBytes(mapSock.bytesAvailable));
		}else{
			mapAuth();
		}
	}
	
	private function mapConnectHandler(event:Event):void {
		logJS("connected " + event+"\n");
		//send hello
		mapSock.writeUTFBytes("FlashHello^_^");
		mapSock.flush();
		//add data listener
		mapSock.addEventListener(ProgressEvent.SOCKET_DATA, mapDataHandler); 
		//check messages by timer, if no additional data
		
		dataTimer.addEventListener(TimerEvent.TIMER, mapTimeDataHandler);
		dataTimer.start();
		currMsg=0;
	}
	
  	private function mapConnectCloseHandler(event:Event):void {
		logJS("closed" + event+"\n");
		mapAuthorised=false;
		mapClosed();
		dataTimer.removeEventListener(TimerEvent.TIMER, mapTimeDataHandler);
		dataTimer.stop();
	}
	
       private const NPC_SET_SIZE:int=9;
       private const TOWER_SET_SIZE:int=9;
	
	//messaging with map server
	//msg to server
	private const MSG_SPAWN_TOWER:int= 1;
	private const MSG_SPAWN_NPC:int= 2;
	private const MSG_DROP_TOWER:int= 3;
	private const MSG_MOVE_HERO:int= 4;
	private const MSG_SET_TARGET:int= 5;
	
	//msg to client
	private const MSG_TEST:int= 0;
	private const MSG_NPC:int= 1;
	private const MSG_TOWER:int= 2;
	private const MSG_BULLET:int= 3;
	private const MSG_PLAYER:int= 4;
	private const MSG_INFO:int= 5;
	//additional messages to client
	private const MSG_INFO_WAITING_TIME:int= 1;
	//npc messages
	private const NPC_HEALTH:int= BIT_1;
	private const NPC_POSITION:int= BIT_2;
	private const NPC_CREATE:int= BIT_3;
	private const NPC_LEVEL:int= BIT_4;
	private const NPC_SHIELD:int= BIT_5;
	private const NPC_STATUS:int= BIT_6;
	//tower messages
	private const TOWER_HEALTH:int= BIT_1;
	private const TOWER_TARGET:int= BIT_2;
	private const TOWER_CREATE:int= BIT_3;
	private const TOWER_LEVEL:int= BIT_4;
	private const TOWER_SHIELD:int= BIT_5;
	//bullet messages
	private const BULLET_POSITION:int= BIT_1;
	private const BULLET_DETONATE:int= BIT_2;
	private const BULLET_CREATE:int= BIT_3;
	//player constants
	private const PLAYER_BASE:int= BIT_1;
	private const PLAYER_MONEY:int= BIT_2;
	private const PLAYER_CREATE:int= BIT_3;
	private const PLAYER_LEVEL:int= BIT_4;
	private const PLAYER_HERO:int= BIT_5;
	private const PLAYER_HERO_COUNTER:int= BIT_6;
	private const PLAYER_TARGET:int= BIT_7;
	private const PLAYER_FAIL:int= BIT_8;
	
	private var mapDataSeq:Array = new Array();
	private var mapObj:String="";
	private var currMsg:int=0;
	
	private function sendMap(value:String):int {
		if (mapAuthorised){
			return sendSocket(mapSock,value);
		}
		return 0;
	}
	
	// push - add to end
	// shift - get first
	private function proceedMapMessagesJS(value:String):void {
		if (isReady) {
			ExternalInterface.call("proceedMapMessages", value);
		}
	}
	
	private var msgTime:int=0;
	
	private function mapGetMessage():void {
		var data:Number;
		var str:String;
//		mapDataSeq.push("push","float",5)//add to end
		//see first
		do {
//			logJS(mapDataSeq+" || "+mapDataSeq[0]);
			try{
				switch (mapDataSeq[0]){
					case undefined: //lets see for next message
						if (mapObj.length>2){//send object to javasctript
						        var time:int=flash.utils.getTimer();
						        mapObj+=",time:"+time+"},";
						        if (time-msgTime>80){
								proceedMapMessagesJS(mapObj+"])");
								mapObj="([";
								msgTime=time;
							}
						}
						currMsg=mapSock.readByte();
						mapDataSeq.push("bitmask");
						mapObj+="{msg:"+currMsg;
					
						break;
					
					case "bitmask": //need to get bitmask
						
						var bitMask:int;
						bitMask=mapSock.readInt();
						mapDataSeq.shift();
						mapGetParamsByBitMask(bitMask);
						
						break;
						
					default:
						switch (mapDataSeq[1]){
							case "{":
								str="{$:0";
								break;
							case "}":
								mapObj+="}";
							case "none":
							case "nil":
							case "null":
								str="0";
								break;
							case "int":
								data=mapSock.readInt();
								str=data+""
								break;						
							case "short":
								data=mapSock.readShort();
								str=data+""
								break;						
							case "byte":
							case "char":
								data=mapSock.readByte();
								str=data+""
								break;						
							case "float":
								data=mapSock.readFloat();
								str=data+""
								break;
							case "double":
								data=mapSock.readDouble();
								str=data+""
								break;
//							case "string": //we have third argument string size
//								str=mapSock.readUTFBytes(mapDataSeq[2]);
//								mapDataSeq.splice(2,1);
//								break;
						}
						mapObj+=","+mapDataSeq[0]+":"+str;
						mapDataSeq.shift();
						mapDataSeq.shift();
	//						mapDataSeq.splice(0,2);
						
						break;
						
				}
			}
			catch (error:Error){
				return;
			}
//			logJS("step");
		} while(mapSock.bytesAvailable>0);
	}
	
	//auth params
	private var latency:int;
	
	private function mapAuth():void {
		var id:int;
		var loop:Boolean=true;
		switch (currMsg){
			case 0:
				try{
					id=mapSock.readInt();
					mapObj="({id:"+id;
					currMsg++;
					logJS("got id "+id);
				}
				catch(error:Error){
//					logJS("id error"+error+"\n");
				}
				break;
			case 1:
				try{
					id=mapSock.readInt();
					mapObj+=",players:"+id;
					currMsg++;
					logJS("got players "+id);
					mapSock.writeInt(0);
					mapSock.flush();
					latency=flash.utils.getTimer();
				}
				catch(error:Error){
//					logJS("players error"+error+"\n");
				}
				break;
			case 2:
				try{
					id=mapSock.readInt();
					latency=flash.utils.getTimer()-latency;
					logJS("latency "+latency);
					mapObj+=",latency:"+latency;
					mapAuthorised=true;
					mapConnected();
					//send to Javascript
					ExternalInterface.call("mapAuthData", mapObj+"})");
					currMsg=0;
					mapObj="([";
				}
				catch(error:Error){
//					logJS("players error"+error+"\n");
				}
				break;
		}
	}
	
	private function mapGetParamsByBitMask(bitMask:int):void{
		var i:int;
		//here must be list of getting obj params 
		switch (currMsg){
			case MSG_NPC:
				mapObj+=",objtype:\"Npc\"";
				mapDataSeq.push("id","int");
				if ((bitMask&NPC_CREATE)!=0){ //npc create
					mapObj+=",create:1";
					mapDataSeq.push("owner","int");
					mapDataSeq.push("type","int");
				}
				if ((bitMask&NPC_POSITION)!=0){ 
					mapDataSeq.push("grid","{");
					mapDataSeq.push("x","float");
					mapDataSeq.push("y","float");
					mapDataSeq.push("$","}");
				}
				if ((bitMask&NPC_LEVEL)!=0){ //npc level
					mapDataSeq.push("level","short");
				}
				if ((bitMask&NPC_HEALTH)!=0){ //npc health
					mapDataSeq.push("health","int");
				}
				if ((bitMask&NPC_SHIELD)!=0){ //npc health
					mapDataSeq.push("shield","int");
				}
				if ((bitMask&NPC_STATUS)!=0){ 
					mapDataSeq.push("status","byte");
				}
				return;
			case MSG_TOWER:
				mapObj+=",objtype:\"Tower\"";
				mapDataSeq.push("id","int");
				if ((bitMask&TOWER_CREATE)!=0){ 
					mapObj+=",create:1";
					mapDataSeq.push("type","int");
					mapDataSeq.push("owner","int");
					mapDataSeq.push("position","int");
				}
				if ((bitMask&TOWER_TARGET)!=0){ 
					mapDataSeq.push("target","short");
				}
				if ((bitMask&TOWER_LEVEL)!=0){ 
					mapDataSeq.push("level","short");
				}
				if ((bitMask&TOWER_HEALTH)!=0){ 
					mapDataSeq.push("health","int");
				}
				if ((bitMask&TOWER_SHIELD)!=0){ 
					mapDataSeq.push("shield","int");
				}
				return;
			case MSG_BULLET:
				mapObj+=",objtype:\"Bullet\"";
				mapDataSeq.push("id","int");
				if ((bitMask&BULLET_POSITION)!=0){
					mapDataSeq.push("grid","{");
					mapDataSeq.push("x","float");
					mapDataSeq.push("y","float");
					mapDataSeq.push("$","}");
				}
				if ((bitMask&BULLET_CREATE)!=0){ 
					mapObj+=",create:1";
					mapDataSeq.push("type","int");
					mapDataSeq.push("owner","int");
					mapDataSeq.push("source","{");
					mapDataSeq.push("x","float"); //source x
					mapDataSeq.push("y","float"); //source y
					mapDataSeq.push("$","}");
				}
				if ((bitMask&BULLET_DETONATE)!=0){ 
					mapDataSeq.push("detonate","byte");
				}
				return;
			case MSG_PLAYER:
				mapObj+=",objtype:\"Player\"";
				mapDataSeq.push("id","int");
				if ((bitMask&PLAYER_CREATE)!=0){ 
					mapDataSeq.push("pid","int");
					mapDataSeq.push("tower_set","{");
					for(i=0;i<NPC_SET_SIZE;i++){
						mapDataSeq.push(""+i,"{");
						mapDataSeq.push("id","int");
						mapDataSeq.push("size","int");
						mapDataSeq.push("$","}");
					}
					mapDataSeq.push("$","}");//TODO : add normal parser
					mapDataSeq.push("npc_set","{");//fix
					for(i=0;i<TOWER_SET_SIZE;i++){
						mapDataSeq.push(""+i,"{");
						mapDataSeq.push("id","int");
						mapDataSeq.push("size","int");
						mapDataSeq.push("$","}");
					}
					mapDataSeq.push("$","}");
					mapDataSeq.push("group","int");
					mapDataSeq.push("_hero_counter","int");
					
					mapDataSeq.push("base_type","{");//fix
					mapDataSeq.push("health","int");//fix
					mapDataSeq.push("$","}");
					mapDataSeq.push("hero_type","{");//fix
					mapDataSeq.push("health","int");//fix
					mapDataSeq.push("shield","int");//fix
					mapDataSeq.push("$","}");
				}
				if ((bitMask&PLAYER_HERO)!=0){ 
					mapDataSeq.push("hero","int");
				}
				if ((bitMask&PLAYER_HERO_COUNTER)!=0){ 
					mapDataSeq.push("hero_counter","int");
				}
				if ((bitMask&PLAYER_BASE)!=0){ //what is it??
					mapDataSeq.push("base","int");
				}
				if ((bitMask&PLAYER_LEVEL)!=0){ 
					mapDataSeq.push("level","int");
				}
				if ((bitMask&PLAYER_MONEY)!=0){ 
					mapDataSeq.push("money","int");
				}
				if ((bitMask&PLAYER_TARGET)!=0){ 
					mapDataSeq.push("targeting","short");
				}
				if ((bitMask&PLAYER_FAIL)!=0){
					mapObj+=",fail:1";
					mapDataSeq.push("exp","int");
				}
				return;
			case MSG_INFO:
				if (bitMask==MSG_INFO_WAITING_TIME){
					mapObj+=",type:'time'";
					mapDataSeq.push("data","short");
				}
				return;
			default:
				logJS("unnown message");
				break;
		}
	}
    }
    
}


//mxmlc -static-link-runtime-shared-libraries -use-network=true ExternalInterfaceExample.as
