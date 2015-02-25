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
	
        public function ExternalInterfaceExample() {
		Security.allowDomain("*");
		Security.allowInsecureDomain("*")
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
		
		getMesage();
	
		if (ExternalInterface.available) {
			try {
				if (checkJavaScriptReady()) {
					output.appendText("JavaScript is ready.\n");
					setupCallBacks()
				} else {
					output.appendText("JavaScript is not ready, creating timer.\n");
					var readyTimer:Timer = new Timer(3000, 0);
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
                ExternalInterface.addCallback("connTest", connectMap);
		//add javascript info about init flash
	}

        private function timerHandler(event:TimerEvent):void {
		output.appendText("Checking JavaScript status...\n");
		isReady = checkJavaScriptReady();
		if (isReady) {
			setupCallBacks();
			output.appendText("JavaScript is ready.\n");
			Timer(event.target).stop();
		}
        }
	
        private function receivedFromJavaScript(value:String):void {
            output.appendText("JavaScript says: " + value + "\n");
        }
	
        private function sendToJavaScript(value:String):void {
		if (isReady) {
			ExternalInterface.call("sendToJavaScript", value);
		}
	}
	
        private function checkJavaScriptReady():Boolean {
            var R:Boolean = ExternalInterface.call("isReady");
            return R;
        }
	
        private function clickHandler(event:MouseEvent):void {
		if (ExternalInterface.available) {
			ExternalInterface.call("sendToJavaScript", input.text);
		}
        }
	
	//Sockets
	private function errorHandler(event:ErrorEvent):void {
		sendToJavaScript("got Error" + event+"\n");
	}
	
	private function ioErrorHandler(event:IOErrorEvent):void {
		sendToJavaScript("got IOError" + event+"\n");
	}
	
	private function securityErrorHandler(event:IOErrorEvent):void {
		sendToJavaScript("got SecurityError" + event+"\n");
	}
	//socket has data
	private function dataHandler(event:ProgressEvent):void {
		sendToJavaScript("got data" + event+"\n");
		var str:String;
		str=mapSock.readUTFBytes(event.bytesLoaded);
		sendToJavaScript("got: "+str);
		
		mapSock.writeUTFBytes(str);
		mapSock.flush();
		//getMessage
	}
	
	private function connectHandler(event:Event):void {
		sendToJavaScript("connected " + event+"\n");
		mapSock.writeUTFBytes("hello");
		mapSock.flush();
	}
	
  	private function closeHandler(event:Event):void {
		sendToJavaScript("closed" + event+"\n");
	}
	
        private function connectMap(value:String):void {
	        sendToJavaScript("Try to connect\n");
		mapSock= new Socket();
		mapSock.endian = Endian.LITTLE_ENDIAN;
		mapSock.addEventListener(Event.CONNECT, connectHandler); 
		mapSock.addEventListener(Event.CLOSE, closeHandler); 
		mapSock.addEventListener(ErrorEvent.ERROR, errorHandler); 
		mapSock.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler); 
		mapSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
		mapSock.addEventListener(ProgressEvent.SOCKET_DATA, dataHandler); 
    
		try {
			mapSock.connect("localhost", 12345);
//			mapSock.connect("smtp.yandex.ru", 25);
			sendToJavaScript("Socket connected: " + mapSock.connected + "\n");
		}
		catch (error:SecurityError) {
			sendToJavaScript("An Error occurred: " + error.message + "\n");
		}
		catch (error:IOError) {
			sendToJavaScript("An IO Error occurred: " + error.message + "\n");
		}
        }
	
	//messaging with server
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
	private var currMsg:int;
	
	// push - add to end
	// shift - get first
	
	private function getMesage():void {
		var str:String;
		var data:Number;
//		dataSeq.push("push","float",5)//add to end
		output.appendText(dataSeq+"\n");//see first
		do {
			switch (dataSeq[0]){
				case undefined: //lets see for next message
					if (outObj.length>0){//send object to javasctript
						sendToJavaScript(outObj+",timer:"+flash.utils.getTimer()+"})");
//						output.appendText(outObj+"\n");
						outObj="";
					}
					try{
						currMsg=mapSock.readByte();
	//					output.appendText(dataSeq.shift()+"\n");//get & del first
						dataSeq.push("id");
						outObj="({msg:"+currMsg;
					}
					catch (error:Error){
						output.appendText("get Error"+error+"\n");
						return;
					}
					break;
				
				case "id": //lets see for next message
					try{
						data=mapSock.readInt();
//						output.appendText(dataSeq.shift()+"\n");//get & del first
						dataSeq.push("bitmask");
						outObj+=",id:"+data;
					}
					catch (error:Error){
//						output.appendText("get Error"+error+"\n");
						return;
					}
					break;
				
				case "bitmask": //need to get bitmask
					try{
						var bitMask:int;
						bitMask=mapSock.readInt();
	//						output.appendText(dataSeq.shift()+"\n");//get & del first
						dataSeq=getParamsByBitMask(bitMask);
						dataSeq.shift();
					}
					catch (error:Error){
	//						output.appendText("get Error"+error+"\n");
						return;
					}
					break;
					
				default:
					try{
						switch (dataSeq[1]){
							case "int":
								data=mapSock.readInt();
	//							output.appendText(dataSeq.shift()+"\n");//get & del first
								break;						
							case "short":
								data=mapSock.readShort();
	//							output.appendText(dataSeq.shift()+"\n");//get & del first
								break;						
							case "byte":
							case "char":
								data=mapSock.readByte();
	//							output.appendText(dataSeq.shift()+"\n");//get & del first
								break;						
							case "float":
								data=mapSock.readFloat();
	//							output.appendText(dataSeq.shift()+"\n");//get & del first
								break;
							case "string": //we have third argument string size
								str=mapSock.readUTFBytes(dataSeq[2]);
								dataSeq.splice(2,1);
								break;
						}
						outObj+=","+dataSeq[0]+": "+data;
//						dataSeq.shift();
//						dataSeq.shift();
						dataSeq.splice(0,2);
					}
					catch (error:Error){
	//						output.appendText("get Error"+error+"\n");
						return;
					}
					break;
					
			}
		} while(dataSeq.length>0);
	}

	private function getParamsByBitMask(bitMask:int):Array {
		var out:Array=[];
		//here must be list of getting obj params 
		switch (currMsg){
			case MSG_TEST:
				break;
			case MSG_NPC:
				if ((bitMask&NPC_CREATE)!=0){ //npc create
					outObj+=",create:1";
					dataSeq.push("owner","int");
					dataSeq.push("type","int");
				}
				dataSeq.push("x","float");
				dataSeq.push("y","float");
				if ((bitMask&NPC_LEVEL)!=0){ //npc level
					dataSeq.push("level","short");
				}
				if ((bitMask&NPC_HEALTH)!=0){ //npc health
					dataSeq.push("health","int");
				}
				if ((bitMask&NPC_SHIELD)!=0){ //npc health
					dataSeq.push("shield","int");
				}
				break;
			case MSG_TOWER:
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
					dataSeq.push("shield","short");
				}
				break;
			case MSG_BULLET:
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
				break;
				
		}
		return out;
	}
    }
    
}


//mxmlc -static-link-runtime-shared-libraries -use-network=true ExternalInterfaceExample.as
