define(function(require, exports, module) {

    var mixinMethods = {

        // mixin the functionality of an array / single functional mixins
        mixin: function(target, mixins)
        {
            // if being called from within another context, assume target is
            // this pointer
            if (this !== mixinMethods) {
                mixins = target;
                target = this;
            }

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

            return target;
        },

        // create a function using that allows a class to extend itself into a
        // surrogate child class with all the good mixins
        makeUsing: function(Child)
        {
            return function() {
                var MixinClass = Child.extend();
                mixinMethods.mixin.apply(
                    MixinClass.prototype, _(arguments).toArray());
                return MixinClass;
            };
        },

        // create a functional mixin from an imformative hash, doing semantic
        // checks while forming
        defineMixin: function(obj)
        {
            return function()
            {
            };
        }

    };

    return mixinMethods;
});
