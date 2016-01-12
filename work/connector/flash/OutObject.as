package {
	import flash.errors.*;

    public class OutObject {
        private var obj:String;
        
		public function OutObject(o:String) {
            obj=""+o;
		}
		
		public function add(o:String):void {
            obj+=o;
		}
		
		public function cleanup():String {
            return obj.replace(/\$\:0,?/g, "");
		}
		
		public function build():String {
            return obj;
		}
		
		public function length():int {
            return obj.length;
		}
		
		public function clear(o:String):void {
            obj=""+o;
		}
    }
}
