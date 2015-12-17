//on server manager need to add listener on port 843, for sending private pollicy file
package {
		import flash.system.Security;
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

    public class Connector extends Sprite {
		private var input:TextField;
		private var output:TextField;
		private var sendBtn:Sprite;
		private var isReady:Boolean=false;
		private var date:Date = new Date();
		//public
		public var publicAuthorised:Boolean=false;
		public var publicSock:Socket = new Socket();
		public var publicWorker:PublicWorker;
		private var publicTimer:Timer = new Timer(250, 0);//40, 0);
		//map
		public var mapSock:Socket = new Socket();
		public var mapWorker:MapWorker;

		public var mapAuthorised:Boolean=false;
		public var mapHost:String;
		public var mapPort:int;
		

		public function Connector() {
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
			ExternalInterface.addCallback("sendToConnector", receivedFromJavaScript);
			ExternalInterface.addCallback("mapConnect", connectMap);
			ExternalInterface.addCallback("mapClose", closeMap);
			ExternalInterface.addCallback("mapSend", sendMap);
			ExternalInterface.addCallback("publicConnect", connectPublic);
			ExternalInterface.addCallback("publicSend", sendPublic);
// 				ExternalInterface.addCallback("startMap", startMap);
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
        
        //logging
        public function logJS(value:String):void {
			if (isReady) {
				ExternalInterface.call("sendToJavaScript", "Flash: "+value);
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
		private var BM_PLAYER_ROOM:int= BIT_3; 
		//out message types
		private const MESSAGE_PLAYER_CHANGE:int= 1;
		private const MESSAGE_GAME_START:int= 2;
		private const MESSAGE_EVENT_CHANGE:int= 3;
		private const MESSAGE_EVENT_DROP:int= 4;
		//
		private var publicMsg:int;
		private var publicDataSeq:Array = new Array();
		private var publicOutObj:OutObject = new OutObject("({");
		
		public function publicConnectError(value:String):void {
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

		public function publicConnected(s:String):void {
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
//				logJS("got timer data" + event+"\n");
			if (publicSock.bytesAvailable>0){
				var pevent:ProgressEvent;
				publicDataHandler(pevent);
			}
		}

		//when socket has data
		private function publicDataHandler(event:ProgressEvent):void {
//				logJS("got data" + event+"\n");
			if (publicAuthorised){
				publicGetMessage();
//					logJS("got data " + mapSock.readUTFBytes(mapSock.bytesAvailable));
			}else{
				publicAuth();
			}
		}

		public function publicAuthFail():void {
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
						publicOutObj.add("id: "+id+",");
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
						publicOutObj.add("time:"+timestamp+",");
						publicAuthorised=true;
						publicOutObj.add("})");
						publicConnected(publicOutObj.build());
						publicOutObj.clear("([");
					}
					catch(error:Error){
	//					logJS("players error"+error+"\n");
					}
					break;
			}
		}
	
		public function proceedPublicMessagesJS(value:String):void {
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
							if (publicOutObj.length()>2){//send object to javasctript
                                var time:int=flash.utils.getTimer();
                                publicOutObj.add(",time:"+time+"},");
                                if (time-publicMsgTime>120){
									publicOutObj.add("])");
									proceedPublicMessagesJS(publicOutObj.build());
									publicOutObj.clear("([");
									publicMsgTime=time;
								}
							}
							publicMsg=publicSock.readByte();
							if (publicMsg!=0){
								publicDataSeq.push("bitmask");
								publicOutObj.add("{msg:"+publicMsg);
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
									publicOutObj.add("}");
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
							publicOutObj.add(","+publicDataSeq[0]+":"+str);
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
					publicOutObj.add(",objtype:\"Event\",action:\"change\"");
					publicOutObj.add(",id:"+bitMask); //bitmask is id of event
	//				publicDataSeq.push("id","int");
	//				publicDataSeq.push("rooms","int");
	//				if ((bitMask&BM_EVENT_MAP_NAME)!=0) {
					publicDataSeq.push("map","string");
					publicDataSeq.push("name","string");
	//				}
					return;
				case MESSAGE_EVENT_DROP:
					publicOutObj.add(",objtype:\"Event\",action:\"drop\"");
					publicOutObj.add(",id:"+bitMask); //bitmask is id of event
					return;
				case MESSAGE_PLAYER_CHANGE:
	//				logJS("MESSAGE_PLAYER_CHANGE");
					publicOutObj.add(",objtype:\"Player\"");
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
					publicOutObj.add(",objtype:\"Room\",action:\"ready\"");
					publicOutObj.add(",event_id:"+bitMask);
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
		public function mapConnectError(value:String):void {
			if (isReady) {
				ExternalInterface.call("mapConnectionError", value);
			}
		}

		private function closeMap():void {
			mapWorker.close();
		}
		
		private function connectMap(host:String, port:String):int {
			logJS("Try to connect\n");
			mapHost=host;
			mapPort=int(port);
			mapWorker=new MapWorker(this, host, int(port));
			return 0;
        }
	
		public function mapClosed():void{
			mapWorker=null;
			ExternalInterface.call("mapClosed");
		}
		
		private function sendMap(value:String):int {
			if (mapAuthorised){
				return sendSocket(mapSock,value);
			}
			return 0;
		}

		// push - add to end
		// shift - get first
		public function proceedMapMessagesJS(value:String):void {
			if (isReady) {
				ExternalInterface.call("proceedMapMessages", value);
			}
		}
		
		public function mapAuthData(s:String):void{
			ExternalInterface.call("mapAuthData", s);
		}
		
		public function mapConnected():void{
			ExternalInterface.call("mapConnected");
		}
    }
}


//mxmlc -static-link-runtime-shared-libraries -use-network=true ExternalInterfaceExample.as
