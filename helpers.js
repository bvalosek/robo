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
        },

        // check the annotation signatures
        sameAnnotations: function(a1, a2)
        {
            var ka1 = _(a1.keys);
            var ka2 = _(a2.keys);

            var d1 = _(ka1).difference(ka2);
            var d2 = _(ka2).difference(ka1);

            return (d1.length == 0 && d2.length == 0);
        }

    };

    return helpers;
});
