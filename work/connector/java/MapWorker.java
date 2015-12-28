class MapWorker implements Runnable{
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

	private final int NPC_SET_SIZE=9;
	private final int TOWER_SET_SIZE=9;

	//msg to client
	private final int MSG_TEST= 0;
	private final int MSG_NPC= 1;
	private final int MSG_TOWER= 2;
	private final int MSG_BULLET= 3;
	private final int MSG_PLAYER= 4;
	private final int MSG_INFO= 5;
	//additional messages to client
	private final int MSG_INFO_WAITING_TIME= 1;
	//npc messages
	private final int NPC_HEALTH= BIT_1;
	private final int NPC_POSITION= BIT_2;
	private final int NPC_CREATE= BIT_3;
	private final int NPC_LEVEL= BIT_4;
	private final int NPC_SHIELD= BIT_5;
	private final int NPC_STATUS= BIT_6;
	//tower messages
	private final int TOWER_HEALTH= BIT_1;
	private final int TOWER_TARGET= BIT_2;
	private final int TOWER_CREATE= BIT_3;
	private final int TOWER_LEVEL= BIT_4;
	private final int TOWER_SHIELD= BIT_5;
	//bullet messages
	private final int BULLET_POSITION= BIT_1;
	private final int BULLET_DETONATE= BIT_2;
	private final int BULLET_CREATE= BIT_3;
	//player final intants
	private final int PLAYER_BASE= BIT_1;
	private final int PLAYER_MONEY= BIT_2;
	private final int PLAYER_CREATE= BIT_3;
	private final int PLAYER_LEVEL= BIT_4;
	private final int PLAYER_HERO= BIT_5;
	private final int PLAYER_HERO_COUNTER= BIT_6;
	private final int PLAYER_TARGET= BIT_7;
	private final int PLAYER_FAIL= BIT_8;
	private final int PLAYER_SETS= BIT_9;
	
	private LittleEndianDataInputStream sin;
	private LittleEndianOutputStream sout;
	
	private int currMsg=0;
	private OutObject obj=new OutObject("");
		
	private Connector connector;
	private String user;
	private int token;
			
	public MapWorker(Connector c, String u, int t){
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
		logJS("Map Thread started");
		try {
			connector.mapSock=connector.connectToServer(connector.mapHost, connector.mapPort);
			sin = new LittleEndianDataInputStream(connector.mapSock.getInputStream());
			sout = new LittleEndianOutputStream(connector.mapSock.getOutputStream());
			
			sout.writeBytes("JavaApplet^_^");
			obj.add("({id:"+sin.readInt());
			obj.add(",players:"+sin.readInt());
			sout.writeInt(0);
			sout.flush();
			long latency=System.currentTimeMillis();
			int l=sin.readInt();
			latency=System.currentTimeMillis()-latency;
			obj.add(",latency:"+latency);
			connector.mapAuthorised=true;
			connector.mapConnected();
			connector.mapAuthData(obj.build()+"})");
			obj.clear("{");
			connector.mapObj.clear("([");
			//auth end
			while(true){
				if (obj.length()>1){
					synchronized(connector.mapObj) {
						connector.mapObj.add(obj.build()+"},");
					}
				}
				currMsg=sin.readByte();
				obj.clear("{msg:"+currMsg);
				int bitMask=sin.readInt();
				getParamsByBitMask(bitMask);
			}
		} catch (Exception e){
			logJS(""+e);
//			connector.mapConnectError(e);
		}
		//close map on exit
		logJS("closed: Connection error");
		connector.mapAuthorised=false;
		connector.mapClosed();
		logJS("Map Thread exited");
	}
	
	private void getParamsByBitMask(int bitMask) throws Exception{
		int i;
		switch (currMsg){
			case MSG_NPC:
				obj.add(",objtype:\"Npc\"");
				obj.add(",id:"+sin.readInt());
				if ((bitMask&NPC_CREATE)!=0){ //npc create
					obj.add(",create:1");
					obj.add(",owner:"+sin.readInt());
					obj.add(",type:"+sin.readInt());
				}
				if ((bitMask&NPC_POSITION)!=0){ 
					obj.add(",grid:{");
						obj.add("x:"+sin.readFloat());
						obj.add(",y:"+sin.readFloat());
					obj.add("}");
				}
				if ((bitMask&NPC_LEVEL)!=0){ //npc level
					obj.add(",level:"+sin.readShort());
				}
				if ((bitMask&NPC_HEALTH)!=0){ //npc health
					obj.add(",health:"+sin.readInt());
				}
				if ((bitMask&NPC_SHIELD)!=0){ //npc health
					obj.add(",shield:"+sin.readInt());
				}
				if ((bitMask&NPC_STATUS)!=0){ 
					obj.add(",status:"+sin.readByte());
				}
				return;
			case MSG_TOWER:
				obj.add(",objtype:\"Tower\"");
				obj.add(",id:"+sin.readInt());
				if ((bitMask&TOWER_CREATE)!=0){ 
					obj.add(",create:1");
					obj.add(",type:"+sin.readInt());
					obj.add(",owner:"+sin.readInt());
					obj.add(",position:"+sin.readInt());
				}
				if ((bitMask&TOWER_TARGET)!=0){ 
					obj.add(",target:"+sin.readShort());
				}
				if ((bitMask&TOWER_LEVEL)!=0){ 
					obj.add(",level:"+sin.readShort());
				}
				if ((bitMask&TOWER_HEALTH)!=0){ 
					obj.add(",health:"+sin.readInt());
				}
				if ((bitMask&TOWER_SHIELD)!=0){ 
					obj.add(",shield:"+sin.readInt());
				}
				return;
			case MSG_BULLET:
				obj.add(",objtype:\"Bullet\"");
				obj.add(",id:"+sin.readInt());
				if ((bitMask&BULLET_POSITION)!=0){
					obj.add(",grid:{");
						obj.add("x:"+sin.readFloat());
						obj.add(",y:"+sin.readFloat());
					obj.add("}");
				}
				if ((bitMask&BULLET_CREATE)!=0){ 
					obj.add(",create:1");
					obj.add(",type:"+sin.readInt());
					obj.add(",owner:"+sin.readInt());
					obj.add(",source:{");
						obj.add("x:"+sin.readFloat()); //source x
						obj.add(",y:"+sin.readFloat()); //source y
					obj.add("}");
				}
				if ((bitMask&BULLET_DETONATE)!=0){ 
					obj.add(",detonate:"+sin.readByte());
				}
				return;
			case MSG_PLAYER:
				obj.add(",objtype:\"Player\"");
				obj.add(",id:"+sin.readInt());
				if ((bitMask&PLAYER_CREATE)!=0){ 
					obj.add(",pid:"+sin.readInt());
					obj.add(",group:"+sin.readInt());
					obj.add(",_hero_counter:"+sin.readInt());
					
					obj.add(",base_type:{");//fix
						obj.add("health:"+sin.readInt());//fix
					obj.add("}");
					obj.add(",hero_type:{");//fix
						obj.add("health:"+sin.readInt());//fix
						obj.add(",shield:"+sin.readInt());//fix
					obj.add("}");
				}
				if ((bitMask&PLAYER_SETS)!=0){
					obj.add(",tower_set:{");
						for(i=0;i<NPC_SET_SIZE;i++){
							obj.add(i+":{");
								obj.add("id:"+sin.readInt());
								obj.add(",size:"+sin.readInt());
							obj.add("},");
						}
					obj.add("}");//TODO : add normal parser
					
					obj.add(",npc_set:{");//fix
						for(i=0;i<TOWER_SET_SIZE;i++){
							obj.add(i+":{");
								obj.add("id:"+sin.readInt());
								obj.add(",size:"+sin.readInt());
							obj.add("},");
						}
					obj.add("}");
				}
				if ((bitMask&PLAYER_HERO)!=0){ 
					obj.add(",hero:"+sin.readInt());
				}
				if ((bitMask&PLAYER_HERO_COUNTER)!=0){ 
					obj.add(",hero_counter:"+sin.readInt());
				}
				if ((bitMask&PLAYER_BASE)!=0){ //what is it??
					obj.add(",base:"+sin.readInt());
				}
				if ((bitMask&PLAYER_LEVEL)!=0){ 
					obj.add(",level:"+sin.readInt());
				}
				if ((bitMask&PLAYER_MONEY)!=0){ 
					obj.add(",money:"+sin.readInt());
				}
				if ((bitMask&PLAYER_TARGET)!=0){ 
					obj.add(",targeting:"+sin.readShort());
				}
				if ((bitMask&PLAYER_FAIL)!=0){
					obj.add(",fail:1");
					obj.add(",exp:"+sin.readInt());
				}
				return;
			case MSG_INFO:
				if (bitMask==MSG_INFO_WAITING_TIME){
					obj.add(",type:'time'");
					obj.add(",data:"+sin.readInt());
				}
				return;
			default:
				logJS("unnown message");
				break;
		}
	}
	
	public void close() throws Exception{
		connector.mapSock.close();
	}
}
//  MapWorker ends
