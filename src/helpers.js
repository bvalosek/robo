define(function(require, exports, module) {

    var _ = require('underscore');

    var helpers = {

        // apply but for constructors
        applyToConstructor: function(T, any, other, args)
        {
            return new (Function.prototype.bind.apply(T, arguments))();
        },

        getWindowHash: function()
        {
            return window.location.hash.substring(1);
        }

    };

    return helpers;
});
