/*
Copyright (c) 2014, Artem Abashev <artem@abashev.com>


Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

/*jslint browser: true*/

var $FlashWarp = (function () {
    'use strict';
    
    var 
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpGate
    //
    //--------------------------------------------------------------------------
    
        /**
         * Creates a new wrapper for a flash object with the provided ID. 
         * @param {string} id ID of the flash object.
         * @class FlashWarpGate
         * @classdesc Flash object wrapper.
         * @throws Will throw an error if the requested ID was not found in the document.
         */
        FlashWarpGate = function (id) {
            this.flashObject = window.document.getElementById(id);

            if (!this.flashObject) {
                throw "Element " + id + " not found";
            }

            this.token = id;
            this.functionsMap = {};
            this.bindings = {};

            return this;
        },
        
        flashWarpMap = {},

    //--------------------------------------------------------------------------
    //
    //  FlashWarp
    //
    //--------------------------------------------------------------------------

        /**
         * Get or create a flash wrapper.
         * @global
         * @param {string} id ID of the flash object.
         * @param {string} command Optional function name to invoke on the flash wrapper.
         * This is an advanced argument and it is not intended to be used in the end-user code.
         * @param {Array} args An optional array or arguments to pass with the command.
         * @returns {FlashWarpGate} Requested wrapper object.
         * @throws Will throw an error if the requested ID was not found in the document.
         */
        $FlashWarp = function (id, command, args) {
            if (command === "dispose") {
                delete flashWarpMap[id];
                return;
            }

            var gate = flashWarpMap[id] || (flashWarpMap[id] = new FlashWarpGate(id));

            if (command) {
                gate[command].apply(gate, args);
            } else {
                return gate;
            }
            
            return null;
        },
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpBinding
    //
    //--------------------------------------------------------------------------

        /**
         * @class FlashWarpBinding
         * @classdesc Warp.
         */
        FlashWarpBinding = function (host, name) {
            this.host = host;
            this.name = name;
            this.listeners = [];

            return this;
        };
    
    FlashWarpBinding.prototype = {
        host: null,
        name: null,
        listeners: null,
        value: null,
        
        /**
         * Add a value change listener to the binding.
         * @param {function} handler Handler function.
         * @memberof FlashWarpBinding
         * @instance
         */
        addListener: function (handler) {
            if (this.listeners.indexOf(handler) !== -1) {
                return;
            }
            
            this.listeners.push(handler);
        },
        
        /**
         * Remove a value change listener from the binding.
         * @param {function} handler Handler function.
         * @memberof FlashWarpBinding
         * @instance
         */
        removeListener: function (handler) {
            var index = this.listeners.lastIndexOf(handler);
            
            if (index === -1) {
                return;
            }
            
            this.listeners[index] = null;
        },
        
        /**
         * Set new value.
         * @param {object} value Value to set.
         * @param {boolean} Apply change only to the local side of the binding.
         * @memberof FlashWarpBinding
         * @instance
         */
        setValue: function (value, local) {
            if (this.value === value) {
                return;
            }
            
            this.value = value;

            for (var i = 0; i < this.listeners.length; i++) {
                var handler = this.listeners[i];
                
                if (!handler) {
                    continue;
                }
                
                try {
                    handler(this.value, this.name);
                } catch (e) {
                    console.warn(e.name + ": " + e.message);
                    continue;
                }
            }
            
            if (!local) {
                this.host.updateBinding(this.name, this.value, true);
            }
        }
    };
    
    //--------------------------------------------------------------------------
    //
    //  FlashWarpGate
    //
    //--------------------------------------------------------------------------
    
    FlashWarpGate.prototype = {
        token: null,
		flashObject: null,
        functionsMap: null,
        bindings: null,
        
        /**
         * Execute a function of this wrapper.
         * @param {string} name Alias name.
         * @param {array} args Function arguments.
         * @memberof FlashWarpGate
         * @instance
         * @returns Wrapper function return value.
         */
        exec: function (name, args) {
            return this.functionsMap[name].apply(null, args);
        },
        
        /**
         * Create named function mapping.
         * @param {string} name Alias name.
         * @param {function} handler Handler function.
         * @memberof FlashWarpGate
         * @instance
         */
        map: function (name, handler) {
            this.functionsMap[name] = handler;
        },
        
        /**
         * Remove named function mapping.
         * @param {string} name Alias name.
         * @memberof FlashWarpGate
         * @instance
         */
        unmap: function (name) {
            delete this.functionsMap[name];
        },
        
        /**
         * Invoke a remote function.
         * @param {string} name Function alias.
         * @memberof FlashWarpGate
         * @instance
         * @returns Remote function return value.
         */
        invoke: function (name) {
            var args = arguments.length > 1 ?
                Array.prototype.slice.call(arguments, 1) :
                undefined;
            return this.flashObject.exec(name, args);
        },

        /**
         * Create a named binding.
         * @param {string} name Binding alias.
         * @memberof FlashWarpGate
         * @instance
         * @returns {FlashWarpBinding} Binding object.
         */
        binding: function (name) {
            var bind = this.bindings[name];
            
            if (bind) {
                return bind;
            }
            
            bind = this.bindings[name] = new FlashWarpBinding(this, name);

            return bind;
        },
        
        /**
         * Update binding value.
         * @param {string} name Binding alias.
         * @param {object} value New value.
         * @param {boolean} propagate Propagate new value to the other side of the binding.
         * @memberof FlashWarpGate
         * @instance
         */
        updateBinding: function (name, value, propagate) {
            if (propagate) {
                this.flashObject.updateBinding(name, value);
            } else {
                this.binding(name).setValue(value, true);
            }
        }
	};
    
    return $FlashWarp;
})();