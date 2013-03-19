define(function(require, exports, module) {

    var mixinMethods = {

        mixin: function(target, m)
        {
            m.call(target);
            return target;
        }

    };

    return mixinMethods;
});
