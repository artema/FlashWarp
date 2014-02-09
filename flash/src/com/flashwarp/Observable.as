package com.flashwarp
{
	import flash.events.*;
	
	/**
	 * Observable implementation.
	 * 
	 * @author Artem Abashev
	 */
	internal final class Observable extends EventDispatcher implements IObservable
	{
		public function Observable(name:String)
		{
			this.name = name;
		}
		
		public var name:String;
		
		private var _value:*;
		
		public function get value():*
		{
			return _value;
		}
		
		public function set value(value:*):void
		{
			if (value !== _value)
			{
				_value = value;
				
				var event:ObservableEvent = new ObservableEvent(ObservableEvent.CHANGE);
				event.value = value;
				event.propagate = true;
				dispatchEvent(event);
			}
		}
		
		internal function setValue(value:*):void
		{
			if (value !== _value)
			{
				_value = value;
				
				var event:ObservableEvent = new ObservableEvent(ObservableEvent.CHANGE);
				event.value = value;
				dispatchEvent(event);
			}
		}
	}
}