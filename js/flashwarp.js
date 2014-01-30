'use strict';

(function (window) {
    var FlashWarpGate = function (id) {
        this.flashObject = window.document.getElementById(id);

        if (!this.flashObject)
            throw new Error("Element " + id + " not found");
        
        this.token = id;
        this.functionsMap = {};
        
        return this;
    };

    var flashWarpMap = {};
    
    var FlashWarp = function (id, command, args)
    {        
        var gate = flashWarpMap[id] || (flashWarpMap[id] = new FlashWarpGate(id));
        
        if (command)
        {                  
            gate[command].apply(gate, args);
        }
        
        return gate;
    };

    FlashWarpGate.prototype =
	{
        token: null,
		flashObject: null,
        functionsMap: null,
        
        mapFunction: function (name, handler)
        {
            this.functionsMap[name] = handler;
            return this;
        },
        
        unmapFunction: function (name)
        {
            delete this.functionsMap[name];
        },
        
        execFunction: function (name, args)
        {
            this.functionsMap[name].call(null, args);
        }
	};
    
    if (!window.FlashWarp)
        window.$FlashWarp = FlashWarp;
}) (window);