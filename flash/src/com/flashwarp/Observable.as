/*
Copyright (c) 2014, Artem Abashev <artem@abashev.com>


Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
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