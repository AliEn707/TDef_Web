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
	private var dataTimer:Timer = new Timer(160, 0);//40, 0);
	
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
	
	//Sockets
	private var mapAuthorised:Boolean=false;
	
	private function connectMap(host:String, port:String):void {
	        logJS("Try to connect\n");
		output.appendText(host+" "+port+"\n");
		
		mapSock= new Socket();
		mapSock.endian = Endian.LITTLE_ENDIAN;
		mapSock.addEventListener(Event.CONNECT, mapConnectHandler); 
		mapSock.addEventListener(Event.CLOSE, closeHandler); 
		mapSock.addEventListener(ErrorEvent.ERROR, errorHandler); 
		mapSock.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler); 
		mapSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
    
		try {
			mapSock.connect(host, int(port));
//			mapSock.connect("smtp.yandex.ru", 25);
			logJS("Socket connected: " + mapSock.connected);
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
        }
	
	private function errorHandler(event:ErrorEvent):void {
		logJS("got Error" + event);
	}
	
	private function ioErrorHandler(event:IOErrorEvent):void {
		logJS("got IOError"+event);
	}
	
	private function securityErrorHandler(event:SecurityErrorEvent):void {
		logJS("got SecurityError"+event);
	}
	
	//time event wrapper for data handler
	private function mapTimeDataHandler(event:TimerEvent):void {
//		logJS("got timer data" + event+"\n");
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
	
  	private function closeHandler(event:Event):void {
		logJS("closed" + event+"\n");
		mapAuthorised=false;
		dataTimer.stop();
	}
	
       private const NPC_SET_SIZE:int=9;
       private const TOWER_SET_SIZE:int=9;
	
	//messaging with map server
	//msg to client
	private const MSG_TEST:int= 0;
	private const MSG_NPC:int= 1;
	private const MSG_TOWER:int= 2;
	private const MSG_BULLET:int= 3;
	private const MSG_PLAYER:int= 4;
	//msg to server
	private const MSG_SPAWN_TOWER:int= 1;
	private const MSG_SPAWN_NPC:int= 2;
	private const MSG_DROP_TOWER:int= 3;
	private const MSG_MOVE_HERO:int= 4;
	private const MSG_SET_TARGET:int= 5;
	//bit constants
	private const BIT_1:int= 1;
	private const BIT_2:int= 2;
	private const BIT_3:int= 4;
	private const BIT_4:int= 8;
	private const BIT_5:int= 16;
	private const BIT_6:int= 32;
	private const BIT_7:int= 64;
	private const BIT_8:int= 128;
	private const BIT_9:int=256;
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
	//npc messages
	private const NPC_HEALTH:int= BIT_1;
	private const NPC_POSITION:int= BIT_2;
	private const NPC_CREATE:int= BIT_3;
	private const NPC_LEVEL:int= BIT_4;
	private const NPC_SHIELD:int= BIT_5;
	//tower messages
	private const TOWER_HEALTH:int= BIT_1;
	private const TOWER_TARGET:int= BIT_2;
	private const TOWER_CREATE:int= BIT_3;
	private const TOWER_LEVEL:int= BIT_4;
	private const TOWER_SHIELD:int= BIT_5;
	//bullet messages
	private const BULLET_POSITION:int=  BIT_1;
	private const BULLET_DETONATE:int=  BIT_2;
	private const BULLET_CREATE:int=  BIT_3;
	//player constants
	private const PLAYER_HEALTH:int=   BIT_1
	private const PLAYER_MONEY:int=   BIT_2
	private const PLAYER_CREATE:int=   BIT_3
	private const PLAYER_LEVEL:int=   BIT_4
	private const PLAYER_HERO:int=   BIT_5
	private const PLAYER_HERO_COUNTER:int=   BIT_6
	private const PLAYER_TARGET:int=   BIT_7
	
	private var dataSeq:Array = new Array();
	private var outObj:String="";
	private var currMsg:int=0;
	
	// push - add to end
	// shift - get first
	 private function proceedReceivedDataJS(value:String):void {
		if (isReady) {
			ExternalInterface.call("proceedReceivedData", value);
		}
	}
	
	private var msgTime:int=0;
	private function mapGetMessage():void {
		var data:Number;
		var str:String;
//		dataSeq.push("push","float",5)//add to end
		//see first
		do {
//			logJS(dataSeq+" || "+dataSeq[0]);
			try{
				switch (dataSeq[0]){
					case undefined: //lets see for next message
						if (outObj.length>2){//send object to javasctript
              var time:int=flash.utils.getTimer();
              outObj+=",time:"+time+"},";
              if (time-msgTime>33){
                proceedReceivedDataJS(outObj+"])");
                outObj="([";
                msgTime=time;
							}
						}
						currMsg=mapSock.readByte();
						dataSeq.push("oid");
						outObj+="{msg:"+currMsg;
					
						break;
					
					case "oid": 
						
						data=mapSock.readInt();
						dataSeq.shift();
						dataSeq.push("bitmask");
						outObj+=",id:"+data;
						
						break;
					
					case "bitmask": //need to get bitmask
						
						var bitMask:int;
						bitMask=mapSock.readInt();
						dataSeq.shift();
						getParamsByBitMask(bitMask);
						
						break;
						
					default:
						switch (dataSeq[1]){
							case "{":
								str="{$:0";
								break;
							case "}":
								outObj+="}";
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
//							case "string": //we have third argument string size
//								str=mapSock.readUTFBytes(dataSeq[2]);
//								dataSeq.splice(2,1);
//								break;
						}
						outObj+=","+dataSeq[0]+":"+str;
						dataSeq.shift();
						dataSeq.shift();
	//						dataSeq.splice(0,2);
						
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
					outObj="({id:"+id;
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
					outObj+=",players:"+id;
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
					outObj+=",latency:"+latency;
					mapAuthorised=true;
					currMsg=0;
					//send to Javascript
					ExternalInterface.call("mapAuthData", outObj+"})");
					outObj="([";
				}
				catch(error:Error){
//					logJS("players error"+error+"\n");
				}
				break;
		}
	}
	
	private function getParamsByBitMask(bitMask:int):void{
		var i:int;
		//here must be list of getting obj params 
		switch (currMsg){
			case MSG_NPC:
				outObj+=",objtype:\"Npc\"";
				if ((bitMask&NPC_CREATE)!=0){ //npc create
					outObj+=",create:1";
					dataSeq.push("owner","int");
					dataSeq.push("type","int");
				}
				dataSeq.push("grid","{");
				dataSeq.push("x","float");
				dataSeq.push("y","float");
				dataSeq.push("$","}");
				if ((bitMask&NPC_LEVEL)!=0){ //npc level
					dataSeq.push("level","short");
				}
				if ((bitMask&NPC_HEALTH)!=0){ //npc health
					dataSeq.push("health","int");
				}
				if ((bitMask&NPC_SHIELD)!=0){ //npc health
					dataSeq.push("shield","int");
				}
				return;
			case MSG_TOWER:
				outObj+=",objtype:\"Tower\"";
				if ((bitMask&TOWER_CREATE)!=0){ 
					outObj+=",create:1";
					dataSeq.push("type","int");
					dataSeq.push("owner","int");
					dataSeq.push("position","int");
				}
				if ((bitMask&TOWER_TARGET)!=0){ 
					dataSeq.push("target","short");
				}
				if ((bitMask&TOWER_LEVEL)!=0){ 
					dataSeq.push("level","short");
				}
				if ((bitMask&TOWER_HEALTH)!=0){ 
					dataSeq.push("health","int");
				}
				if ((bitMask&TOWER_SHIELD)!=0){ 
					dataSeq.push("shield","int");
				}
				return;
			case MSG_BULLET:
				outObj+=",objtype:\"Bullet\"";
				dataSeq.push("x","float");
				dataSeq.push("y","float");
				if ((bitMask&BULLET_CREATE)!=0){ 
					outObj+=",create:1";
					dataSeq.push("type","int");
					dataSeq.push("owner","int");
					dataSeq.push("sx","float"); //source x
					dataSeq.push("sy","float"); //source y
				}
				if ((bitMask&BULLET_DETONATE)!=0){ 
					dataSeq.push("detonate","byte");
				}
				return;
			case MSG_PLAYER:
				outObj+=",objtype:\"Player\"";
				if ((bitMask&PLAYER_CREATE)!=0){ 
					dataSeq.push("pid","int");
					dataSeq.push("tower_set","{");
					for(i=0;i<NPC_SET_SIZE;i++){
						dataSeq.push(""+i,"{");
						dataSeq.push("id","int");
						dataSeq.push("size","int");
						dataSeq.push("$","}");
					}
					dataSeq.push("$","}");//TODO : add normal parser
					dataSeq.push("npc_set","{");//fix
					for(i=0;i<TOWER_SET_SIZE;i++){
						dataSeq.push(""+i,"{");
						dataSeq.push("id","int");
						dataSeq.push("size","int");
						dataSeq.push("$","}");
					}
					dataSeq.push("$","}");
					dataSeq.push("group","int");
					dataSeq.push("_hero_counter","int");
					dataSeq.push("base","int");
					
					dataSeq.push("base_type","{");//fix
					dataSeq.push("health","int");//fix
					dataSeq.push("$","}");
					dataSeq.push("hero_type","{");//fix
					dataSeq.push("health","int");//fix
					dataSeq.push("shield","int");//fix
					dataSeq.push("$","}");
				}
				if ((bitMask&PLAYER_HERO)!=0){ 
					dataSeq.push("hero","int");
				}
				if ((bitMask&PLAYER_HERO_COUNTER)!=0){ 
					dataSeq.push("hero_counter","int");
				}
				if ((bitMask&PLAYER_HEALTH)!=0){ //what is it??
					dataSeq.push("health","int");
				}
				if ((bitMask&PLAYER_LEVEL)!=0){ 
					dataSeq.push("level","int");
				}
				if ((bitMask&PLAYER_MONEY)!=0){ 
					dataSeq.push("money","int");
				}
				if ((bitMask&PLAYER_TARGET)!=0){ 
					dataSeq.push("target","short");
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
