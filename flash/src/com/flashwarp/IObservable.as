package com.flashwarp
{
	import flash.events.IEventDispatcher;

	/**
	 * Observable object.
	 * 
	 * @author Artem Abashev
	 */
	public interface IObservable extends IEventDispatcher
	{
		[Bindable("change")]
		/**
		 * Current value.
		 */
		function get value():*;		
		function set value(value:*):void;
	}
}