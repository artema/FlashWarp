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
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarp
    //
    //--------------------------------------------------------------------------
    
    var FlashWarp = function (id, command, args)
    {        
        var gate = flashWarpMap[id] || (flashWarpMap[id] = new FlashWarpGate(id));
        
        if (command)
        {                  
            gate[command].apply(gate, args);
        }
        
        return gate;
    };
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpBinding
    //
    //--------------------------------------------------------------------------

    var FlashWarpBinding = function (name)
    {
        this.name = name;
        
        return this;  
    };
    
    FlashWarpBinding.prototype = 
    {
        name: null
    };
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpGate
    //
    //--------------------------------------------------------------------------
    
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
            this.flashObject.exec(name, args);
        },
        
        bind: function (name)
        {
            var binding = new FlashWarpBinding(name);
            
            return binding;
        }
	};
    
    if (!window.FlashWarp)
        window.$FlashWarp = FlashWarp;
}) (window);