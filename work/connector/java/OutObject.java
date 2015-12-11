import java.io.*;

public class OutObject {
    //change String to smth to increase performance
    protected String obj;

    public OutObject(String o) {
        obj=o;
    }
    
    public void add(String o){
        obj+=o;
    }
    
    public String build(){
        return obj;
    }
        
    public int length(){
        return obj.length();
    }
        
    public void clear(String o){
        obj=o;
    }
    
}
