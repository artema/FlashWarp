package com.flashwarp
{
	import flash.events.Event;
	
	/**
	 * Observable event.
	 * 
	 * @author Artem Abashev
	 */
	public final class ObservableEvent extends Event
	{
		public static const CHANGE:String = "change";
		
		public function ObservableEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}
		
		public var value:*;
		
		internal var propagate:Boolean;
		
		override public function clone():Event
		{
			var event:ObservableEvent = new ObservableEvent(type, bubbles, cancelable);
			event.value = value;
			event.propagate = propagate;
			return event;
		}
	}
}