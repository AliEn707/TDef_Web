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
	private String obj = "({";
	
	
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
		} catch (Exception e){
			logJS(""+e);
		}
		//some work
		logJS("Public Thread exited");
	}
}
//  PublicWorker ends
