define(function(require, exports, module) {

    var mixinMethods = {

        // mixin the functionality of an array / single functional mixins
        mixin: function(target, mixins)
        {
            if (_(mixins).isFunction())
                mixins = [mixins];
            else if (mixins === undefined)
                mixins = [];

            // ensure we have our own copy of the mixin tracker
            if (!target.hasOwnProperty('__mixins__'))
                Object.defineProperty(target, '__mixins__', {
                    value: target.__mixins__ ? _(target.__mixins__).clone() : [],
                    enumberable: false, writable: false
                });

            // add any mixin we don't already have
            mixins.forEach(function(m) {
                if (~target.__mixins__.indexOf(m))
                    return;

                m.call(target);
                target.__mixins__.push(m);
            });
        }

    };

    return mixinMethods;
});
