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
		public var publicSock:Socket = new Socket();
		public var publicWorker:PublicWorker;
		public var publicObj:OutObject=new OutObject("");	
		public var publicAuthorised:Boolean=false;
		public var publicHost:String;
		public var publicPort:int;
		//map
		public var mapSock:Socket = new Socket();
		public var mapWorker:MapWorker;
		public var mapObj:OutObject=new OutObject("");	
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
			ExternalInterface.addCallback("mapGetData", mapGetData);
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
		public function publicGetData():String {
			var str:String;
			if (publicObj.length()>2){
				str=publicObj.build()+"])";
				publicObj.clear("([")
			}else{
				str="";
			}
			return str;
		}
		
		public function publicConnectError(value:String):void {
			if (isReady) {
				ExternalInterface.call("publicConnectionError", value);
			}
		}
		
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
			publicHost=host;
			publicPort=int(port);
			publicWorker=new PublicWorker(this, u, int(p));
			return 0;
        }
	
		public function publicAuthFail():void {
			ExternalInterface.call("publicAuthFail");
		}

		public function proceedPublicMessagesJS(value:String):void {
			if (isReady) {
				ExternalInterface.call("proceedPublicMessages", value);
			}
		}
///------------------------------------------------------------------------------------------------------	
	///map
		
		public function mapGetData():String {
			var str:String;
			if (mapObj.length()>2){
				str=mapObj.build()+"])";
				mapObj.clear("([")
			}else{
				str="";
			}
			return str;
		}
		
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
