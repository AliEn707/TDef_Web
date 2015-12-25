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
        
    //public
    public Socket publicSock;
    public PublicWorker publicWorker;
	public OutObject publicObj=new OutObject("");
	public Boolean publicAutorised=false;
    public String publicHost;
    public int publicPort;
    //map
    public Socket mapSock;
    public MapWorker mapWorker;
	public OutObject mapObj=new OutObject("");
	public Boolean mapAutorised=false;
    public String mapHost;
    public int mapPort;
       
    public void logJS(Object arg){
		ExternalInterface.call("sendToJavaScript", "Java: "+arg);
    }
    
    public Socket connectToServer(String host, int port) throws Exception{
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
	///public
//----------------------------------	
   public String publicGetData(){
	   String str="";
        synchronized(publicObj) {
			if (publicObj.length()>2){
				str=publicObj.build()+"])";
				publicObj.clear("([");
			}
        }
		return str;
    } 
    
	public void publicConnect(String host, String sport, String user, String token){
		publicPort = Integer.parseInt(sport);
		publicHost = host;
		try {
			//start thread
			publicWorker = new PublicWorker(this, user, Integer.parseInt(token));
		} catch (Exception e) {
			logJS(""+e);
		}
    } 
    
    public void publicSend(String value){
		socketSend(publicSock, value);
    }	
	///map
//----------------------------------	
   public String mapGetData(){
	   String str="";
        synchronized(mapObj) {
			if (mapObj.length()>2){
				str=mapObj.build()+"])";
				mapObj.clear("([");
			}
        }
		return str;
    } 
    
	public void mapConnectError(String value) {
		if (isReady) {
			ExternalInterface.call("mapConnectionError", value);
		}
	}

	public void mapClose() {
		try{
			mapWorker.close();
		} catch (Exception e) {
			
		}
	}

    public void mapConnect(String host, String sport){
		mapPort = Integer.parseInt(sport);
		mapHost = host;
		try {
			//start thread
			mapWorker = new MapWorker(this, host, mapPort);
		} catch (Exception e) {
			logJS(""+e);
		}
    }
	
	public void mapClosed(){
		mapWorker=null;
		ExternalInterface.call("mapClosed");
	}

    public void mapSend(String value){
		if (mapAuthorised){
			socketSend(mapSock, value);
		}
    }
    
	public void mapAuthData(String s){
		if (isReady)
			ExternalInterface.call("mapAuthData", s);
	}
	
	public void mapConnected(){
		if (isReady)
			ExternalInterface.call("mapConnected");
	}
}