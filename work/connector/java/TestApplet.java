import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import netscape.javascript.*;
 
public class TestApplet extends JApplet {
 
    private JButton button = new JButton("Call Javascript");
    private JLabel label = new JLabel();
 
    public void init() {
        getContentPane().setLayout(new BorderLayout());
        getContentPane().add(button, BorderLayout.NORTH);
        getContentPane().add(label, BorderLayout.SOUTH);
 
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                Thread runner = new Thread(new Runnable() {
                    public void run() {
                        try {
                            testLiveConnect();
                        } catch (JSException jse) {
                            // Error
                            jse.printStackTrace();
                        }
                    }
                });
                runner.start();
            }
        });
    }
    private void testLiveConnect() throws JSException {
        JSObject jso = JSObject.getWindow(this);
 
        // call Javascript's method foo() with no argument
        String result = (String) jso.call("foo", null);
        label.setText(result);
 
        // delay 2 seconds to see the result
        try { Thread.sleep(2000); } catch (InterruptedException ie) {};
 
        // call Javascript's method foo() with two arguments
        result = (String) jso.call("bar", new String[] {"Alice", "Alisa"});
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