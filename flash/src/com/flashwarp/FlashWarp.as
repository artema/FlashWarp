package com.flashwarp
{
	import flash.errors.IllegalOperationError;
	import flash.external.ExternalInterface;
	import flash.utils.Dictionary;

	/**
	 * JavaScript-Flash bridge.
	 * 
	 * @author Artem Abashev
	 */
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
			ExternalInterface.addCallback("updateBinding", updateBindingHandler);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Public methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Declare function as available from JavaScript by the name.
		 * 
		 * @param name Function mapping alias.
		 * @param handler Function to map.
		 */
		public static function map(name:String, handler:Function):void
		{
			_instance.doMap(name, handler);			
		}
		
		/**
		 * Remove function mapping.
		 * 
		 * @param name Existing function mapping alias.
		 */
		public static function unmap(name:String):void
		{
			_instance.doUnmap(name);
		}
		
		/**
		 * Invoke mapped JavaScript function by its name with the provided parameters.
		 * 
		 * @param name JavaScript function mapping name.
		 * @params Optional parameters list.
		 */
		public static function invoke(name:String, params:Array = null):*
		{
			return _instance.doInvoke(name, params);
		}
		
		/**
		 * Get observable value for a JavaScript-Flash binding. 
		 * If no binding exists with the provided name, it will be created automatically.
		 * 
		 * @param name Binding alias.
		 */
		public static function binding(name:String):IObservable
		{
			return _instance.doBinding(name);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Data
		//
		//--------------------------------------------------------------------------
		
		private static const JAVASCRIPT_ENDPOINT:String = "$FlashWarp";
		
		private static var _instance:FlashWarp = new FlashWarp();
		
		private const functionsMap:Dictionary = new Dictionary();
		private const bidningsMap:Dictionary = new Dictionary();
		
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
			
			if (!isValidAlias(name)) throw new ArgumentError("name");

			if (functionsMap[name])
				throw new IllegalOperationError("Mapping with alias '" + name + "' already exists.");
			
			functionsMap[name] = handler;
		}
		
		internal function doUnmap(name:String):void
		{
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");
			
			if (!isValidAlias(name)) throw new ArgumentError("name");
			
			if (!functionsMap[name])
				throw new IllegalOperationError("Mapping with alias '" + name + "' does not exist.");
			
			delete functionsMap[name];
		}
		
		internal function doInvoke(name:String, params:Array = null):*
		{	
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");

			if (!isValidAlias(name)) throw new ArgumentError("name");
			
			if (params == null)
				params = [];
			
			return ExternalInterface.call(JAVASCRIPT_ENDPOINT, _id, "exec", [name, params]);
		}
		
		internal function doBinding(name:String):Observable
		{
			if (!_isAvailable)
				throw new IllegalOperationError("External interface is not available.");
			
			if (!isValidAlias(name)) throw new ArgumentError("name");
			
			var observable:Observable = bidningsMap[name] as Observable;
			
			if (observable == null)
			{
				observable = bidningsMap[name] = new Observable(name);
				observable.addEventListener(ObservableEvent.CHANGE, onObservableChange);
			}
				
			return observable;
		}
		
		//--------------------------------------------------------------------------
		//
		//  Event handlers
		//
		//--------------------------------------------------------------------------
		
		private function execHandler(name:String, params:Array = null):*
		{
			if (!isValidAlias(name)) throw new ArgumentError("name");
			
			if (!functionsMap[name])
				throw new IllegalOperationError("Mapping with alias '" + name + "' does not exist.");
			
			if (params == null)
				params = [];
			
			return functionsMap[name].apply(null, params);
		}
		
		private function updateBindingHandler(name:String, value:*):void
		{
			if (!isValidAlias(name)) throw new ArgumentError("name");
			
			doBinding(name).setValue(value);
		}
		
		private function onObservableChange(e:ObservableEvent):void
		{
			if (!e.propagate)
				return;
			
			var binding:Observable = Observable(e.target);
			ExternalInterface.call(JAVASCRIPT_ENDPOINT, _id, "updateBinding", [ binding.name, binding.value ]);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Helper methods
		//
		//--------------------------------------------------------------------------
		
		private static function isValidAlias(name:String):Boolean
		{
			return (name != null && name != "");
		}
	}
}