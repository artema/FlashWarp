'use strict';

(function (window) {
    var FlashWarpGate = function (id) {
        this.flashObject = window.document.getElementById(id);

        if (!this.flashObject)
            throw new Error("Element " + id + " not found");
        
        this.token = id;
        this.functionsMap = {};
        this.bindings = {};

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
        if (command == "dispose")
        {
            delete flashWarpMap[id];
            return;
        }
        
        var gate = flashWarpMap[id] || (flashWarpMap[id] = new FlashWarpGate(id));

        if (command)
        {
            gate[command].apply(gate, args);
        }
        else
            return gate;
    };
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpBinding
    //
    //--------------------------------------------------------------------------

    var FlashWarpBinding = function (host, name)
    {
        this.host = host;
        this.name = name;
        this.listeners = [];
        
        return this;  
    };
    
    FlashWarpBinding.prototype = 
    {
        host: null,
        name: null,
        listeners: null,
        value: null,
        
        addListener: function (handler)
        {
            if (this.listeners.indexOf(handler) != -1)
                return;
            
            this.listeners.push(handler);
        },
        
        removeListener: function (handler)
        {
            var index = this.listeners.lastIndexOf(handler);
            
            if (index == -1)
                return;
            
            this.listeners[index] = null;
        },
        
        setValue: function (value, local)
        {
            if (this.value === value)
                return;
            
            this.value = value;
            
            for (var i = 0; i < this.listeners.length; i++)
            {
                var handler = this.listeners[i];
                
                if (!handler)
                    continue;
                
                try
                {
                    handler(this.value, this.name);
                }
                catch (e)
                {                    
                    console.warn(e.name + ": " + e.message);
                    continue;
                }
            }
            
            if (!local)
                this.host.updateBinding(this.name, this.value, true); 
        }
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
        bindings: null,
        
        exec: function (name, args)
        {
            return this.functionsMap[name].apply(null, args);
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
        invoke: function (name)
        {            
            var args = arguments.length > 1 
                ? Array.prototype.slice.call(arguments, 1)
                : undefined;
            return this.flashObject.exec(name, args);
        },

        binding: function (name)
        {
            var bind = this.bindings[name];
            
            if (bind)
                return bind;
            
            bind = this.bindings[name] = new FlashWarpBinding(this, name);

            return bind;
        },
        
        updateBinding: function (name, value, propagate)
        {
            if (propagate)
                this.flashObject.updateBinding(name, value);              
            else
                this.binding(name).setValue(value, true);
        }
	};
    
    if (!window.$FlashWarp)
        window.$FlashWarp = FlashWarp;
}) (window);