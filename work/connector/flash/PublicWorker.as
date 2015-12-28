//on server manager need to add listener on port 843, for sending private pollicy file
package {
		import flash.system.Security;
		import flash.events.*;
//		import flash.external.ExternalInterface;
		import flash.utils.Timer;
		import flash.utils.Endian;
		
		import flash.net.Socket;
		import flash.errors.*;

    public class PublicWorker {
		private var connector:Connector;
		//sockets
		//TODO: add hosts and ports for future reconnects
		private var timer:Timer = new Timer(250, 0);//40, 0);
		private var date:Date = new Date();
	
		private var user:String;
		private var token:int;
		private var user_id:int=0;
		//
		private var dataSeq:Array = new Array();
		private var obj:OutObject = new OutObject("({");
		private var currMsg:int;
				
		public function PublicWorker(c:Connector, u:String, t:int) {
			connector=c;
			user=u;
			token=t;
			logJS("publicWorker started");
			connect(connector.publicHost, connector.publicPort);
		}
		
		private function logJS(s:String):void{
			connector.logJS(s);
		}	

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

		private function connectError(value:String):void {
			connector.publicConnectError(value);
		}

		public function connect(host:String, port:int):int {
						logJS("Try to connect\n");
			connector.publicSock= new Socket();
			connector.publicSock.endian = Endian.LITTLE_ENDIAN;
			connector.publicSock.addEventListener(Event.CONNECT, connectHandler); 
			connector.publicSock.addEventListener(Event.CLOSE, connectCloseHandler); 
			connector.publicSock.addEventListener(ErrorEvent.ERROR, connectErrorHandler); 
			connector.publicSock.addEventListener(IOErrorEvent.IO_ERROR, connectIoErrorHandler); 
			connector.publicSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, connectSecurityErrorHandler);
			
			currMsg=0;

			try {
				connector.publicSock.connect(host, int(port));
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
	
		private function connectErrorHandler(event:ErrorEvent):void {
			logJS("got Error" + event);
			connectError("Error");
		}

		private function connectIoErrorHandler(event:IOErrorEvent):void {
			logJS("got IOError"+event);
			connectError("IOError");
		}

		private function connectSecurityErrorHandler(event:SecurityErrorEvent):void {
			logJS("got SecurityError"+event);
			connectError("SecurityError");
		}

		private function connectHandler(event:Event):void {
			logJS("connected " + event+"\n");
			//send hello
			connector.publicSock.writeUTFBytes("FlashHello^_^");
			connector.publicSock.flush();
			//add data listener
//			connector.publicSock.addEventListener(ProgressEvent.SOCKET_DATA, dataHandler); 
			//check messages by timer, if no additional data
			
			timer.addEventListener(TimerEvent.TIMER, timeDataHandler);
			timer.start();
			currMsg=0;
		}

		private function connectCloseHandler(event:Event):void {
			logJS("closed" + event+"\n");
			connector.publicAuthFail();
			connector.publicAuthorised=false;
			timer.removeEventListener(TimerEvent.TIMER, timeDataHandler);
			timer.stop();
		}

		//time event wrapper for data handler
		private function timeDataHandler(event:TimerEvent):void {
//				logJS("got timer data" + event+"\n");
			if (connector.publicSock.bytesAvailable>0){
				var pevent:ProgressEvent;
				dataHandler(pevent);
			}
		}

		//when socket has data
		private function dataHandler(event:ProgressEvent):void {
//				logJS("got data" + event+"\n");
			if (connector.publicAuthorised){
				getMessage();
//					logJS("got data " + mapSock.readUTFBytes(mapSock.bytesAvailable));
			}else{
				publicAuth();
			}
		}

		//bitmasks
		private var BM_PLAYER_ROOM:int= BIT_3; 
		//out message types
		private const MESSAGE_PLAYER_CHANGE:int= 1;
		private const MESSAGE_GAME_START:int= 2;
		private const MESSAGE_EVENT_CHANGE:int= 3;
		private const MESSAGE_EVENT_DROP:int= 4;
		
		private function getMessage():void {
			var data:Number;
			var str:String;
			do {
	//			logJS(dataSeq+" || "+dataSeq[0]);
				try{
					switch (dataSeq[0]){
						case undefined: //lets see for next message
	//						logJS("new message");
							if (obj.length()>1){//send object to javasctript
                                connector.publicObj.add(obj.build()+"},");
							}
							currMsg=connector.publicSock.readByte();
							obj.clear("");
							if (currMsg!=0){
								dataSeq.push("bitmask");
								obj.add("{msg:"+currMsg);
							}
							break;
						
						case "bitmask": //need to get bitmask
	//						logJS("get bitmask");

							var bitMask:int;
							bitMask=connector.publicSock.readInt();
							dataSeq.shift();
							getParamsByBitMask(bitMask);
							
							break;
							
						default:
	//						logJS(obj);
	//						logJS("get "+dataSeq[1]);
							switch (dataSeq[1]){
								case "{":
									str="{$:0";
									break;
								case "}":
									obj.add("}");
								case "none":
								case "nil":
								case "null":
									str="0";
									break;
								case "int":
									data=connector.publicSock.readInt();
									str=data+""
									break;						
								case "short":
									data=connector.publicSock.readShort();
									str=data+""
									break;						
								case "byte":
								case "char":
									data=connector.publicSock.readByte();
									str=data+""
									break;						
								case "float":
									data=connector.publicSock.readFloat();
									str=data+""
									break;
								case "double":
									data=connector.publicSock.readDouble();
									str=data+""
									break;
								case "string": //we have short: sizeof string than string  in socket
									str="\""+connector.publicSock.readUTF()+"\"";
	//								dataSeq.splice(2,1);
	//								break;
							}
							obj.add(","+dataSeq[0]+":"+str);
							dataSeq.shift();
							dataSeq.shift();
	//						dataSeq.splice(0,2);
							
							break;
							
					}
				}
				catch (error:Error){
//					logJS(""+error);
					return;
				}
	//			logJS("step");
			} while(connector.publicSock.bytesAvailable>0);
		}

		private function getParamsByBitMask(bitMask:int):void{
			var i:int;
			//here must be list of getting obj params 
			switch (currMsg){
				case MESSAGE_EVENT_CHANGE:
					obj.add(",objtype:\"Event\",action:\"change\"");
					obj.add(",id:"+bitMask); //bitmask is id of event
	//				dataSeq.push("id","int");
	//				dataSeq.push("rooms","int");
	//				if ((bitMask&BM_EVENT_MAP_NAME)!=0) {
					dataSeq.push("map","string");
					dataSeq.push("name","string");
	//				}
					return;
				case MESSAGE_EVENT_DROP:
					obj.add(",objtype:\"Event\",action:\"drop\"");
					obj.add(",id:"+bitMask); //bitmask is id of event
					return;
				case MESSAGE_PLAYER_CHANGE:
	//				logJS("MESSAGE_PLAYER_CHANGE");
					obj.add(",objtype:\"Player\"");
					dataSeq.push("id","int");
					if ((bitMask&BM_PLAYER_ROOM)!=0){
						logJS("BM_PLAYER_ROOM");
						dataSeq.push("room","{");
						dataSeq.push("type","int");
						dataSeq.push("id","int");
						dataSeq.push("$","}");
					}
					return;
				case MESSAGE_GAME_START:
					obj.add(",objtype:\"Room\",action:\"ready\"");
					obj.add(",event_id:"+bitMask);
					dataSeq.push("host","string");
					dataSeq.push("port","int");
	//				if (bitMask)
					return;
				default:
					logJS("unnown public message");
					break;
			}
		}
		
		private function publicAuth():void {
			var id:int;
			var timestamp:Number;
			var loop:Boolean=true;
			switch (currMsg){
				case 0:
					try{
						id=connector.publicSock.readInt();
						connector.publicSock.writeInt(user.length);
						connector.publicSock.writeUTFBytes(user);
						connector.publicSock.writeInt(token);
						connector.publicSock.flush();
						currMsg++;
						logJS("got "+id);
					}
					catch(error:Error){
	//					logJS("id error"+error+"\n");
					}
					break;
				case 1:
					try{
						id=connector.publicSock.readInt();
						currMsg++;
						logJS("id: "+id);
						obj.add("id: "+id+",");
						if (id==0){
							connector.publicSock.close();
							connector.publicAuthFail();
							var event:Event;
							connectCloseHandler(event);//clear handlers
						}
					}
					catch(error:Error){
	//					logJS("players error"+error+"\n");
					}
					break;
				case 2:
					try{
						timestamp=connector.publicSock.readDouble();
						currMsg++;
						logJS("time: "+timestamp);
						obj.add("time:"+timestamp+",");
						connector.publicAuthorised=true;
						obj.add("})");
						connector.publicConnected(obj.build());
						obj.clear("{");
						connector.publicObj.clear("([");
					}
					catch(error:Error){
	//					logJS("players error"+error+"\n");
					}
					break;
			}
		}
	}
}