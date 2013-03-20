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

            // allow for mixins to be an array or just a single function
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
        // checks while forming and ensuring the mixin will update the annotations et al
        defineMixin: function(obj)
        {
            var info = helpers.processAnnotations(obj);

            return function()
            {
                _(info.hash).each(function(fn, key) {

                    // target annotations and mixin annotations
                    var ta = helpers.findAnnotations(this.constructor, key);
                    var ma = info.annotations[key];

                    var prettyT = helpers.prettyPrint(this, key, ta);

                    // Make sure it's either abstract or a function
                    if (!ma.ABSTRACT && !_(fn).isFunction())
                        throw new Error ('Only functions are valid in mixins');

                    var targetFn = this[key];

                    // if we're augmenting the target, do some sanity checks
                    if (targetFn) {
                        if (!_(targetFn).isFunction())
                            throw new Error(
                            'Cannot mixin on top of non-function base member "' +
                                prettyT + '"');

                        if (ma.NEW) {

                            // nop

                        // must be awknolwedged that we're clobbering
                        } else if (!ma.ABSTRACT && !ma.BEFORE && !ma.AFTER && !ma.WRAPPED) {
                            throw new Error ('Must use before, after, or wrapped ' +
                                'annotations when overriding a base member with a mixin');

                        // abstract in mixin is emulating the interface
                        // pattern, so if we already have it, make sure it
                        // matches the targets signature
                        } else if (ma.ABSTRACT) {
                            if (!helpers.sameAnnotations(ta, ma, ['ABSTRACT']))
                                throw new Error ('Member annotation signatures ' +
                                    'must match when mixing in an abstract member');
                        }

                    }


                }.bind(this));
            };
        }

    };

    return mixinMethods;
});
