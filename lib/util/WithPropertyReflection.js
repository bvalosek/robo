var typedef = require('typedef');
var _       = require('underscore');

// Expose static members onto the class that refer to the keys of the
// signature. Are all brought forward and pollute the shit out of the static
// member
module.exports = WithPropertyReflection =
typedef.mixin('WithPropertyReflection').define({

    __ondefine__: function(C)
    {
        _(C.__signature__).each(function(info, key) {
            Object.defineProperty(C, key + 'Property', {
                writable: false, enumberable: false,
                value: key, configurable: true
            });
        });
    }

});
