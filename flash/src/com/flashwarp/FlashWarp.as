package com.flashwarp
{
	import flash.errors.IllegalOperationError;
	import flash.external.ExternalInterface;
	import flash.utils.Dictionary;

	public final class FlashWarp
	{
		private static var _instance:FlashWarp = new FlashWarp();
		
		public static function get instance():FlashWarp{ return _instance; }
		
		public function FlashWarp()
		{
			if (_instance != null) 
				throw new IllegalOperationError();
			
			_isAvailable = ExternalInterface.available;
			
			if (!_isAvailable) return;
			
			_id = ExternalInterface.objectID;
			
			ExternalInterface.addCallback("exec", execHandler);
		}
		
		private var _id:String;
		private var _isAvailable:Boolean;
		
		private const functionsMap:Dictionary = new Dictionary();
		
		public function map(name:String, handler:Function):void
		{
			functionsMap[name] = handler;
		}
		
		public function unmap(name:String):void
		{
			delete functionsMap[name];
		}
		
		public function invoke(name:String, ...parameters):void
		{	
			parameters.unshift(name);
			ExternalInterface.call("$FlashWarp", _id, "exec", parameters);
		}
		
		private function execHandler(name:String, ...parameters):void
		{
			functionsMap[name].apply(null, parameters);
		}
	}
}