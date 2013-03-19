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
        },

        // convert an array of strings into an object with key vals
        makeHash: function(strings, value)
        {
            var h = {};
            _(strings).each(function(s) { h[s] = value ? value : s; });
            return h;
        }

    };

    return helpers;
});
