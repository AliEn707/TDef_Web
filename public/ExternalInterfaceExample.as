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
	private var isReady:Boolean;

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
		if (ExternalInterface.available) {
			ExternalInterface.call("sendToJavaScript", value);
		}
	}
	
        private function checkJavaScriptReady():Boolean {
            var R:Boolean = ExternalInterface.call("isReady");
            return R;
        }
	
        private function clickHandler(event:MouseEvent):void {
		output.appendText(1+ "\n");
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
	
	private var dataSeq:Array = new Array();
	private var outObj:String;
	private var currMsg:int;
	
	// push - add to end
	// shift - get first
	
	private function getMesage():void {
//		dataSeq.push("start")//add to end
		output.appendText(dataSeq[0]+"\n");//see first

		switch (dataSeq[0]){
			case "bitmask":
				try{
					var bitMask:int;
					bitMask=mapSock.readInt();
//						output.appendText(dataSeq.shift()+"\n");//get & del first
					dataSeq=getBitMaskParams(bitMask);
				}
				catch (error:Error){
//						output.appendText("get Error"+error+"\n");
					return;
				}
				break;
				
			case "id":
				try{
					var id:int;
					id=mapSock.readInt();
//						output.appendText(dataSeq.shift()+"\n");//get & del first
					dataSeq.shift();
					outObj+=", id: "+id;
				}
				catch (error:Error){
//						output.appendText("get Error"+error+"\n");
					return;
				}
				break;
				
			default: //no other variants, lets see for next message
				try{
					currMsg=mapSock.readByte();
//						output.appendText(dataSeq.shift()+"\n");//get & del first
					dataSeq.push("bitmask");
					outObj="({type="+currMsg;
				}
				catch (error:Error){
//					output.appendText("get Error"+error+"\n");
					return;
				}
				break;
			
		}
		
	}

	private function getBitMaskParams(bitMask:int):Array {
		var out:Array=[];
		//here must be list of getting obj params 
		return out;
	}
    }
    
}


//mxmlc -static-link-runtime-shared-libraries -use-network=true ExternalInterfaceExample.as
