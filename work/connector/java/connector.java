import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.applet.Applet;
import netscape.javascript.*;
import java.util.concurrent.TimeUnit;
 
import java.net.*;
import java.io.*;
import java.util.*;
import java.security.*;


/*
  // get value of a named member from Javascript
    result = (String) jso.getMember("coop");
    
    ExternalInterface.call("smth", new Object[] {"1",2});
    ExternalInterface.call("smth", "1", 2);
*/


public class Connector extends Applet {
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

//    private JButton button = new JButton("Call Javascript");
//    private JLabel label = new JLabel();
 
    private boolean isReady = false;

    //similar to ActionScript
    private JSObject ExternalInterface;
    
    public Boolean mapAuthorised=false;
    public Boolean publicAuthorised=false;
        
    //Sockets
    private Socket mapSock;
    private Socket publicSock;
    
    private String publicHost;
    private int publicPort;
    
    private String mapHost;
    private int mapPort;
    
    class PublicThread implements Runnable{ //must work all app live time
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
				
        private String user;
        private int token;
        private int user_id=0;
        private LittleEndianDataInputStream sin;
        private LittleEndianOutputStream sout;
				
		public PublicThread setArg(String u, int t){
            user=u;
            token=t;
            return this;
        }
        
        public void run(){
            logJS("Public Thread started");
            try{
                publicSock=connectToServer(publicHost, publicPort);
                sin = new LittleEndianDataInputStream(publicSock.getInputStream());
                sout = new LittleEndianOutputStream(publicSock.getOutputStream());
            } catch (Exception e){
                logJS(""+e);
            }
            //some work
            logJS("Public Thread exited");
        }
    }
    //  PublicThread ends

    class MapThread implements Runnable{
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
        private String obj="";
        private int msgTime=0;
        
        public void run(){
            logJS("Map Thread started");
            try {
                mapSock=connectToServer(mapHost, mapPort);
                sin = new LittleEndianDataInputStream(mapSock.getInputStream());
                sout = new LittleEndianOutputStream(mapSock.getOutputStream());
                
                sout.writeBytes("JavaApplet^_^");
                obj="({id:"+sin.readInt();
                obj+=",players:"+sin.readInt();
                sout.writeInt(0);
                sout.flush();
                long latency=System.currentTimeMillis();
                int l=sin.readInt();
                latency=System.currentTimeMillis()-latency;
                obj+=",latency:"+latency;
                mapAuthorised=true;
                ExternalInterface.call("mapConnected");
                ExternalInterface.call("mapAuthData", obj+"})");
                obj="([";
                
            } catch (Exception e){
                logJS(""+e);
            }
            //close map on exit
            mapClose();
            logJS("Map Thread exited");
        }
    }
    //  MapThread ends
    
    private void logJS(Object arg){
		ExternalInterface.call("sendToJavaScript", "Java: "+arg);
    }
    
    private Socket connectToServer(String host, int port) throws Exception{
        return (Socket)AccessController.doPrivileged(
          new PrivilegedExceptionAction<Socket>() {
            public Socket run() throws Exception {
                //InetAddress ipAddress = InetAddress.getByName(host);
                Socket socket = new Socket(host, port);
                return socket;
            }
          }
        );
    }
    
    public void start() {
      try {
        // System.setSecurityManager(new SecurityManager());
        ExternalInterface = JSObject.getWindow(this);
        // invoke JavaScript function
        
        while (!(Boolean)ExternalInterface.call("isReady")){
          try {
            TimeUnit.MILLISECONDS.sleep(300);
          } catch (InterruptedException e) {
            //Handle exception
          }
        }
        ExternalInterface.call("connectorReady");
        isReady = true;
    
		} catch (JSException jse) {
			jse.printStackTrace();
			isReady = false;
		}
    }
    
    public void sendToConnector(String s){
		logJS(s);
    }
    
    public void mapConnect(String host, String sport){
		mapPort = Integer.parseInt(sport);
		mapHost=host;
		try {
			//start thread
			Thread thread = new Thread(new MapThread());
			thread.setDaemon(true);
			thread.start();
		} catch (Exception e) {
			logJS(""+e);
		}
    }
    
    public void publicConnect(String host, String sport, String user, String stoken){
		publicPort = Integer.parseInt(sport);
		publicHost = host;
		int token = Integer.parseInt(stoken);
		try {
			//start thread
			Thread thread = new Thread(new PublicThread().setArg(user, token));
			thread.setDaemon(true);
			thread.start();
		} catch (Exception e) {
			logJS(""+e);
		}
    } 
    
    public void socketSend(Socket sock, String value){
		ArrayDeque<String> arr=new ArrayDeque<String>();
		Collections.addAll(arr, value.split(","));
		try{
			LittleEndianOutputStream sout=new LittleEndianOutputStream(sock.getOutputStream());
			while(arr.size()>1){
				switch (arr.pollFirst()){
					case "byte":
					case "char":
						sout.writeByte(Byte.parseByte(arr.pollFirst()));
						break;
					case "short":
						sout.writeShort(Short.parseShort(arr.pollFirst()));
						break;
					case "int":
						sout.writeInt(Integer.parseInt(arr.pollFirst()));
						break;
					case "uint":
						sout.writeInt(Integer.parseUnsignedInt(arr.pollFirst()));
						break;
					case "float":
						sout.writeFloat(Float.parseFloat(arr.pollFirst()));
						break;
					case "double":
						sout.writeDouble(Double.parseDouble(arr.pollFirst()));
						break;
					case "string":
						sout.writeUTF(arr.pollFirst());
						break;
				}
			}
		} catch (Exception e) {
            logJS(""+e);
            //mapClose(); //check need
       } 
    }
    
//    public String getMapData(){
//        synchronized(obj) {
//            c2++;
//        }
//    } 
    
    public void mapClose(){
        try{
            mapSock.close();
		} catch (Exception e) {
            logJS(""+e);
		} 
		ExternalInterface.call("mapClosed");
    }

    public void mapSend(String value){
		if (mapAuthorised){
			socketSend(mapSock, value);
		}
    }
    
    public void publicSend(String value){
		socketSend(publicSock, value);
    }
}