'use strict';

(function (window) {
    var FlashWarpGate = function (params) {
        var selector = window.document.querySelectorAll(params),
		    i = 0;

        return this;
    };

    var FlashWarp = function (params) {
        return new FlashWarpGate(params);
    };
    
    FlashWarp.fn = FlashWarpGate.prototype =
	{
		
	};
    
    if (!window.FlashWarp)
        window.$FlashWarp = FlashWarp;
}) (window);