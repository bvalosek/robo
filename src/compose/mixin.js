define(function(require, exports, module) {

    var mixinMethods = {

        mixin: function(target, m)
        {
            m.call(target);
            return target;
        },

        // like mixin but ensures that we get a usuable Class out of the deal
        using: function(Target, m)
        {
        }

    };

    return mixinMethods;
});
