/*
Copyright (c) 2014, Artem Abashev <artem@abashev.com>


Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
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