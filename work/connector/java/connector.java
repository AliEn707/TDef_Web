import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.applet.Applet;
import netscape.javascript.*;
 
public class connector extends Applet {
 
    private JButton button = new JButton("Call Javascript");
    private JLabel label = new JLabel();
 
    public void start() {
        try {
            JSObject window = JSObject.getWindow(this);
            // invoke JavaScript function
            Number age = (Number) window.eval("alert(22)");
            window.call("logJS",new Object[] {"1",2});

        } catch (JSException jse) {
            jse.printStackTrace();
        }
    }
    
    public int test() throws JSException {
      return (int)(Math.random()*2000000);
    }
    
    private void testLiveConnect() throws JSException {
        JSObject jso = JSObject.getWindow(this);
 
        // call Javascript's method foo() with no argument
        String result = (String) jso.call("foo");
        label.setText(result);
 
        // delay 2 seconds to see the result
        try { Thread.sleep(2000); } catch (InterruptedException ie) {};
 
        // call Javascript's method foo() with two arguments
        result = (String) jso.call("bar", (Object[])new String[] {"Alice", "Alisa"});
        label.setText(result);
        try { Thread.sleep(2000); } catch (InterruptedException ie) {};
 
        // execute a Javascript expression
        String expression = "alert('Hi, I am from Javascript.');";
        jso.eval(expression);
        try { Thread.sleep(2000); } catch (InterruptedException ie) {};
 
        // get value of a named member from Javascript
        result = (String) jso.getMember("coop");
        label.setText(result);
        try { Thread.sleep(2000); } catch (InterruptedException ie) {};
 
        // get value of an indexed member from Javascript
        result = (String) jso.getSlot(1);
        label.setText(result);
    }
}