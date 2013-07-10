var typedef = require('typedef');
var Q       = require('q');
var _       = require('underscore');

// The DEFERRED decoration will mutate a member into a deferred value that,
// when set, will resolve
module.exports = WithDeferred = typedef.mixin('WithDeferred').define({

    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            if (info.decorations.DEFERRED) {
                var _key = '_' + key;

                // starting value
                Object.defineProperty(C.prototype, _key, {
                    configurable: true, enumberable: false,
                    writable: true, value: Q.defer()
                });

                // Get will return deferred, set will resolve with value
                Object.defineProperty(C.prototype, key, {
                    configurable: true, enumberable: true,

                    get: function() { return this[_key].promise; },

                    set: function(v) {
                        this[_key].resolve(v);
                    }

                });

            }
        });
    }

});
