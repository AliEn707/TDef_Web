//on server manager need to add listener on port 843, for sending private pollicy file
package {
		import flash.system.Security;
		import flash.events.*;
//		import flash.external.ExternalInterface;
		import flash.utils.Timer;
		import flash.utils.Endian;
		
		import flash.net.Socket;
		import flash.errors.*;

    public class MapWorker {
		private var connector:Connector;
		//sockets
		//TODO: add hosts and ports for future reconnects
		private var timer:Timer = new Timer(100, 0);//40, 0);
		private var date:Date = new Date();
	
		private var user:String;
		private var token:int;
		private var latency:int;
		
		private var dataSeq:Array = new Array();
		private var obj:OutObject=new OutObject("");
		private var currMsg:int=0;
		
		public function MapWorker(c:Connector, u:String, t:int) {
			connector=c;
			user=u;
			token=t;
			logJS("mapWorker started");
			connect(connector.mapHost, connector.mapPort);
		}
		
		private function logJS(s:String):void{
			connector.logJS(s);
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

///------------------------------------------------------------------------------------------------------	
	///map
		private function connectError(value:String):void {
			connector.mapConnectError(value);
		}

		public function close():void {
			connector.mapSock.close();
			var event:Event;
			connectCloseHandler(event);
		}
		
		private function connect(host:String, port:int):int {
			logJS("Try to connect\n");			
			connector.mapSock= new Socket();
			connector.mapSock.endian = Endian.LITTLE_ENDIAN;
			connector.mapSock.addEventListener(Event.CONNECT, connectHandler); 
			connector.mapSock.addEventListener(Event.CLOSE, connectCloseHandler); 
			connector.mapSock.addEventListener(ErrorEvent.ERROR, connectErrorHandler); 
			connector.mapSock.addEventListener(IOErrorEvent.IO_ERROR, connectIoErrorHandler); 
			connector.mapSock.addEventListener(SecurityErrorEvent.SECURITY_ERROR, connectSecurityErrorHandler);
			
			currMsg=0;
			
			try {
				connector.mapSock.connect(host, port);
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

		//time event wrapper for data handler
		private function timeDataHandler(event:TimerEvent):void {
	//		logJS("got timer data" + event+"  bytes"+mapSock.bytesAvailable);
			if (connector.mapSock.bytesAvailable>0){
				var pevent:ProgressEvent;
				mapDataHandler(pevent);
			}
		}
		
		//when socket has data
		private function mapDataHandler(event:ProgressEvent):void {
	//		logJS("got data" + event+"\n");
			if (connector.mapAuthorised){
				getMessage();
	//			logJS("got data " + mapSock.readUTFBytes(mapSock.bytesAvailable));
			}else{
				auth();
			}
		}
		
		private function connectHandler(event:Event):void {
			logJS("connected " + event+"\n");
			//send hello
			connector.mapSock.writeUTFBytes("FlashHello^_^");
			connector.mapSock.flush();
			//add data listener
			connector.mapSock.addEventListener(ProgressEvent.SOCKET_DATA, mapDataHandler); 
			//check messages by timer, if no additional data, needed foe auth
			timer.addEventListener(TimerEvent.TIMER, timeDataHandler);
			timer.start();
			currMsg=0;
		}

		private function connectCloseHandler(event:Event):void {
			logJS("closed" + event+"\n");
			connector.mapAuthorised=false;
			connector.mapClosed();
			timer.removeEventListener(TimerEvent.TIMER, timeDataHandler);
			timer.stop();
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
		private const PLAYER_SETS:int= BIT_9;
		
		private function getMessage():void {
			var data:Number;
			var str:String;
			var s:String;
			var f:String;
	//		mapDataSeq.push("push","float",5)//add to end
			//see first
			do {
	//			logJS(mapDataSeq+" || "+mapDataSeq[0]);
				try{
					switch (dataSeq[0]){
						case undefined: //lets see for next message
							if (obj.length()>1){//send object to javasctript
                                connector.mapObj.add(obj.cleanup()+"},");
							}
							currMsg=connector.mapSock.readByte();
							dataSeq.push("bitmask");
							obj.clear("{msg:"+currMsg);
						
							break;
						
						case "bitmask": //need to get bitmask
							var bitMask:int;
							bitMask=connector.mapSock.readInt();
							dataSeq.shift();
							getParamsByBitMask(bitMask);
							
							break;
							
						default:
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
									data=connector.mapSock.readInt();
									str=data.toString();
									break;						
								case "short":
									data=connector.mapSock.readShort();
									str=data.toString();
									break;						
								case "byte":
								case "char":
									data=connector.mapSock.readByte();
									str=data.toString();
									break;						
								case "float":
									data=connector.mapSock.readFloat();
									//logJS(data+"")
									f=data.toFixed(4);
									s=data.toString();
									str=s.length>f.length ? f : s;
									//logJS(str)
									break;
								case "double":
									data=connector.mapSock.readDouble();
									f=data.toFixed(8);
									s=data.toString();
									str=s.length>f.length ? f : s;
									break;
//									case "string": //we have third argument string size
//									str=mapSock.readUTFBytes(mapDataSeq[2]);
//									mapDataSeq.splice(2,1);
//									break;
							}
							obj.add(","+dataSeq[0]+":"+str);
							dataSeq.shift();
							dataSeq.shift();
//								mapDataSeq.splice(0,2);
							
							break;
							
					}
				}
				catch (error:Error){
					logJS(""+error);
					break;
				}
	//			logJS("step");
			} while(connector.mapSock.bytesAvailable>0);
//			if (connector.mapObj.length()>2){
//				connector.mapObj.add("])");	
//				connector.proceedMapMessagesJS(connector.mapObj.build());
//				connector.mapObj.clear("([");
//				msgTime=flash.utils.getTimer();
//			}
		}

		private function getParamsByBitMask(bitMask:int):void{
			var i:int;
			//here must be list of getting obj params 
			switch (currMsg){
				case MSG_NPC:
					obj.add(",objtype:\"Npc\"");
					dataSeq.push("id","int");
					if ((bitMask&NPC_CREATE)!=0){ //npc create
						obj.add(",create:1");
						dataSeq.push("owner","int");
						dataSeq.push("type","int");
					}
					if ((bitMask&NPC_POSITION)!=0){ 
						dataSeq.push("grid","{");
							dataSeq.push("x","float");
							dataSeq.push("y","float");
						dataSeq.push("$","}");
					}
					if ((bitMask&NPC_LEVEL)!=0){ //npc level
						dataSeq.push("level","short");
					}
					if ((bitMask&NPC_HEALTH)!=0){ //npc health
						dataSeq.push("health","int");
					}
					if ((bitMask&NPC_SHIELD)!=0){ //npc health
						dataSeq.push("shield","int");
					}
					if ((bitMask&NPC_STATUS)!=0){ 
						dataSeq.push("status","byte");
					}
					return;
				case MSG_TOWER:
					obj.add(",objtype:\"Tower\"");
					dataSeq.push("id","int");
					if ((bitMask&TOWER_CREATE)!=0){ 
						obj.add(",create:1");
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
					obj.add(",objtype:\"Bullet\"");
					dataSeq.push("id","int");
					if ((bitMask&BULLET_POSITION)!=0){
						dataSeq.push("grid","{");
							dataSeq.push("x","float");
							dataSeq.push("y","float");
						dataSeq.push("$","}");
					}
					if ((bitMask&BULLET_CREATE)!=0){ 
						obj.add(",create:1");
						dataSeq.push("type","int");
						dataSeq.push("owner","int");
						dataSeq.push("source","{");
							dataSeq.push("x","float"); //source x
							dataSeq.push("y","float"); //source y
						dataSeq.push("$","}");
					}
					if ((bitMask&BULLET_DETONATE)!=0){ 
						dataSeq.push("detonate","byte");
					}
					return;
				case MSG_PLAYER:
					obj.add(",objtype:\"Player\"");
					dataSeq.push("id","int");
					if ((bitMask&PLAYER_CREATE)!=0){ 
						obj.add(",create:1");
						dataSeq.push("pid","int");
						dataSeq.push("group","int");
						dataSeq.push("_hero_counter","int");
						
						dataSeq.push("base_type","{");//fix
							dataSeq.push("health","int");//fix
						dataSeq.push("$","}");
						dataSeq.push("hero_type","{");//fix
							dataSeq.push("health","int");//fix
							dataSeq.push("shield","int");//fix
						dataSeq.push("$","}");
					}
					if ((bitMask&PLAYER_SETS)!=0){
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
					}
					if ((bitMask&PLAYER_HERO)!=0){ 
						dataSeq.push("hero","int");
					}
					if ((bitMask&PLAYER_HERO_COUNTER)!=0){ 
						dataSeq.push("hero_counter","int");
					}
					if ((bitMask&PLAYER_BASE)!=0){ //what is it??
						dataSeq.push("base","int");
					}
					if ((bitMask&PLAYER_LEVEL)!=0){ 
						dataSeq.push("level","int");
					}
					if ((bitMask&PLAYER_MONEY)!=0){ 
						dataSeq.push("money","int");
					}
					if ((bitMask&PLAYER_TARGET)!=0){ 
						dataSeq.push("targeting","short");
					}
					if ((bitMask&PLAYER_FAIL)!=0){
						obj.add(",fail:1");
						dataSeq.push("exp","int");
					}
					return;
				case MSG_INFO:
					obj.add(",objtype:\"Info\"");
					if (bitMask==MSG_INFO_WAITING_TIME){
						obj.add(",type:\"start_timer\"");
					}
					dataSeq.push("data","int");
					return;
				default:
					logJS("unnown message");
					break;
			}
		}
		
		//auth params
		private function auth():void {
			var id:int;
			var loop:Boolean=true;
			switch (currMsg){
				case 0:
					try{
						id=connector.mapSock.readInt();
						obj.clear("({id:"+id);
						currMsg++;
						logJS("got id "+id);
					}
					catch(error:Error){
	//					logJS("id error"+error+"\n");
					}
					break;
				case 1:
					try{
						id=connector.mapSock.readInt();
						obj.add(",players:"+id);
						currMsg++;
						logJS("got players "+id);
						connector.mapSock.writeInt(0);
						connector.mapSock.flush();
						latency=flash.utils.getTimer();
					}
					catch(error:Error){
	//					logJS("players error"+error+"\n");
					}
					break;
				case 2:
					try{
						id=connector.mapSock.readInt();
						latency=flash.utils.getTimer()-latency;
						logJS("latency "+latency);
						obj.add(",latency:"+latency);
						connector.mapAuthorised=true;
						connector.mapConnected();
						//send to Javascript
						obj.add("})");
						connector.mapAuthData(obj.build());
						currMsg=0;
						obj.clear("{");
						connector.mapObj.clear("([");
						timer.removeEventListener(TimerEvent.TIMER, timeDataHandler);//auth ended
						timer.stop();//we do not need it any more
					}
					catch(error:Error){
	//					logJS("players error"+error+"\n");
					}
					break;
			}
		}
    }
}


//mxmlc -static-link-runtime-shared-libraries -use-network=true ExternalInterfaceExample.as
