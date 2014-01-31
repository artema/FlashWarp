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
        
        exec: function (name, args)
        {
            this.functionsMap[name].call(null, args);
        },
        
        map: function (name, handler)
        {
            this.functionsMap[name] = handler;
        },
        
        unmap: function (name)
        {
            delete this.functionsMap[name];
        },      
        
        /**
         * Invoke a remote function.
         */
        invoke: function (name, args)
        {            
            this.flashObject[name](args);
        }
	};
    
    if (!window.FlashWarp)
        window.$FlashWarp = FlashWarp;
}) (window);