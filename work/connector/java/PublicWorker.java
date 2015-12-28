class PublicWorker implements Runnable{ //must work all app live time
	//bit constants
    private final int BIT_1 = 1;
    private final int BIT_2 = 2;
    private final int BIT_3 = 4;
    private final int BIT_4 = 8;
    private final int BIT_5 = 16;
    private final int BIT_6 = 32;
    private final int BIT_7 = 64;
    private final int BIT_8 = 128;
    private final int BIT_9 = 256;
    private final int BIT_10 = 512;
    private final int BIT_11 = 1024;
    private final int BIT_12 = 2048;
    private final int BIT_13 = 4096;
    private final int BIT_14 = 8192;
    private final int BIT_15 = 16384;
    private final int BIT_16 = 32768;
    private final int BIT_17 = 65536;
    private final int BIT_18 = 131072;
    private final int BIT_19 = 262144;
    private final int BIT_20 = 524288;
    private final int BIT_21 = 1048576;
    private final int BIT_22 = 2097152;
    private final int BIT_23 = 4194304;
    private final int BIT_24 = 8388608;
    private final int BIT_25 = 16777216;
    private final int BIT_26 = 33554432;
    private final int BIT_27 = 67108864;
    private final int BIT_28 = 134217728;
    private final int BIT_29 = 268435456;
    private final int BIT_30 = 536870912;
    private final int BIT_31 = 1073741824;
//	private const int BIT_32 = 2147483648;
	//bitmasks
	private final int BM_PLAYER_ROOM= BIT_3; 
	//out message types
	private final int MESSAGE_PLAYER_CHANGE= 1;
	private final int MESSAGE_GAME_START= 2;
	private final int MESSAGE_EVENT_CHANGE= 3;
	private final int MESSAGE_EVENT_DROP= 4;
	//
	private int currMsg;
	private OutObject obj=new OutObject("");
	
	
	private Connector connector;
	private String user;
	private int token;
	private int user_id=0;
	private LittleEndianDataInputStream sin;
	private LittleEndianOutputStream sout;
	
	public PublicWorker(Connector c, String u, int t){
		connector=c;
		user=u;
		token=t;
		Thread thread=new Thread(this);
		thread.setDaemon(true);
		thread.start();
	}
	
	private void logJS(Object arg){
		if (connector!=null)
			connector.logJS(arg);
    }
	
	public void run(){
		logJS(user);
		logJS(token);
		logJS("Public Thread started");
		try{
			connector.publicSock=connector.connectToServer(connector.publicHost, connector.publicPort);
			sin = new LittleEndianDataInputStream(connector.publicSock.getInputStream());
			sout = new LittleEndianOutputStream(connector.publicSock.getOutputStream());
			
			sout.writeBytes("JavaApplet^_^");
			int id=sin.readInt();
			sout.writeInt(user.length());
			sout.writeBytes(user);
			sout.writeInt(token);
			logJS("got "+id);
			id=sin.readInt();
			obj.add("id: "+id+",");
			if (id!=0){
				double timestamp=sin.readDouble();
				logJS("time: "+timestamp);
				obj.add("time:"+timestamp+",");
				connector.publicAuthorised=true;
				obj.add("})");
				connector.publicConnected(obj.build());
				obj.clear("{");
				connector.publicObj.clear("([");
				while(true){
					if (obj.length()>1){
						synchronized(connector.mapObj) {
							connector.mapObj.add(obj.build()+"},");
						}
					}
					currMsg=sin.readByte();
					obj.clear("");
					if (currMsg!=0){
						obj.add("{msg:"+currMsg);
						int bitMask=sin.readInt();
						getParamsByBitMask(bitMask);
					}
				}
			}else{
				connector.publicAuthFail();
			}
			connector.publicSock.close();
		} catch (Exception e){
			logJS(""+e);
		}
		connector.publicConnectError("");
		//some work
		logJS("Public Thread exited");
	}
	
	public void close(){
		
	}
	
	private void getParamsByBitMask(int bitMask) throws Exception{
		int i;
		switch (currMsg){
			case MESSAGE_EVENT_CHANGE:
				obj.add(",objtype:\"Event\",action:\"change\"");
				obj.add(",id:"+bitMask); //bitmask is id of event
//				obj.add("id","int");
//				obj.add("rooms","int");
//				if ((bitMask&BM_EVENT_MAP_NAME)!=0) {
				obj.add(",map:\""+sin.readUTF()+"\"");
				obj.add(",name:\""+sin.readUTF()+"\"");
//				}
				return;
			case MESSAGE_EVENT_DROP:
				obj.add(",objtype:\"Event\",action:\"drop\"");
				obj.add(",id:"+bitMask); //bitmask is id of event
				return;
			case MESSAGE_PLAYER_CHANGE:
//				logJS("MESSAGE_PLAYER_CHANGE");
				obj.add(",objtype:\"Player\"");
				obj.add(",id:"+sin.readInt());
				if ((bitMask&BM_PLAYER_ROOM)!=0){
					logJS("BM_PLAYER_ROOM");
					obj.add(",room:{");
					obj.add("type:"+sin.readInt());
					obj.add(",id:"+sin.readInt());
					obj.add("}");
				}
				return;
			case MESSAGE_GAME_START:
				obj.add(",objtype:\"Room\",action:\"ready\"");
				obj.add(",event_id:"+bitMask);
				obj.add(",host:\""+sin.readUTF()+"\"");
				obj.add(",port:"+sin.readInt());
//				if (bitMask)
				return;
			default:
				logJS("unnown public message");
				break;
		}
	}
}
//  PublicWorker ends
