import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.applet.Applet;
import netscape.javascript.*;
 
import java.net.*;
import java.io.*;

/*
  // get value of a named member from Javascript
    result = (String) jso.getMember("coop");
    
    ExternalInterface.call("smth", new Object[] {"1",2});
    ExternalInterface.call("smth", "1", 2);
*/

public class connector extends Applet {
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
    
    private void logJS(Object arg){
      ExternalInterface.call("sendToJavaScript", "Java: "+arg);
    }
    
    public void start() {
      try {
        ExternalInterface = JSObject.getWindow(this);
        // invoke JavaScript function
        
        if ((Boolean)ExternalInterface.call("isReady")){
          ExternalInterface.call("connectorReady");
          isReady = true;
        }
      } catch (JSException jse) {
        jse.printStackTrace();
        isReady = false;
      }
    }
    
    public void sendToConnector(String s){
      logJS(s);
    }
    
    public void mapConnect(String host, String sport){
      int port = Integer.parseInt(sport);
      logJS(port);
    }
    
    public void mapClose(){
      //TODO: fill body
    }
    
    public void publicConnect(String host, String sport, String user, String stoken){
      int port = Integer.parseInt(sport);
      int token = Integer.parseInt(stoken);
    } 
    
    private void socketSend(Socket sock, String value){
      //TODO: fill body
    }
    
    public void mapSend(String value){
      //socketSend(mapSocket, value);
    }
    
    public void publicSend(String value){
      //socketSend(publicSocket, value);
    }
}