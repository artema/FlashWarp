package com.flashwarp
{
	import flash.errors.IllegalOperationError;
	import flash.external.ExternalInterface;
	import flash.utils.Dictionary;

	public final class FlashWarp
	{
		public function FlashWarp()
		{
			if (_instance != null) 
				throw new IllegalOperationError();
			
			_isAvailable = ExternalInterface.available;
			
			if (!_isAvailable) return;
			
			_id = ExternalInterface.objectID;

			ExternalInterface.addCallback("exec", execHandler);
			
			doMap("updateBinding", updateBinding);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Public methods
		//
		//--------------------------------------------------------------------------
		
		public static function map(name:String, handler:Function):void
		{
			_instance.doMap(name, handler);			
		}
		
		public static function unmap(name:String):void
		{
			_instance.doUnmap(name);
		}
		
		public static function invoke(name:String, ...parameters):void
		{
			_instance.doInvoke(name, parameters);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Data
		//
		//--------------------------------------------------------------------------
		
		private static var _instance:FlashWarp = new FlashWarp();
		
		private const functionsMap:Dictionary = new Dictionary();
		
		private var _id:String;
		private var _isAvailable:Boolean;
		
		//--------------------------------------------------------------------------
		//
		//  Instance methods
		//
		//--------------------------------------------------------------------------
		
		internal function doMap(name:String, handler:Function):void
		{
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");
			
			functionsMap[name] = handler;
		}
		
		internal function doUnmap(name:String):void
		{
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");
			
			delete functionsMap[name];
		}
		
		internal function doInvoke(name:String, ...parameters):void
		{	
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");
			
			parameters.unshift(name);
			ExternalInterface.call("$FlashWarp", _id, "exec", parameters);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Private methods
		//
		//--------------------------------------------------------------------------
		
		private function execHandler(name:String, params:Array):void
		{
			functionsMap[name].apply(null, params);
		}
		
		private function updateBinding(name:String, value:*):void
		{
			return;
		}
	}
}