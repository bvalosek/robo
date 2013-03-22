define(function(require, exports, module) {

    var helpers = require('./helpers');

    var mixinMethods = {

        // mixin the functionality of an array / single functional mixins
        mixin: function(target, mixins)
        {
            // if being called from within another context, assume target is
            // this pointer
            if (mixins === undefined) {
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
                    enumberable: false, writable: false,
                    configurable: true
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
                var mixins = _(arguments).toArray();

                // create string of mixins
                var smix = _(mixins).reduce(function(acc,m) {
                    return acc + ' + ' + (m.__name__ || '?');
                }, '');

                // create the mixin class
                var MixinClass = Child.extend({
                    __name__: '(' + (Child.__name__ || '?') + smix + ')'
                });

                Object.defineProperty(MixinClass, 'Super', {
                    writable: false, enumberable: false,
                    value: Child.Super
                });

                // dat mix
                mixinMethods.mixin.call(MixinClass.prototype, mixins);
                return MixinClass;
            };
        },

        // create a functional mixin from an imformative hash, doing semantic
        // checks while forming and ensuring the mixin will update the annotations et al
        defineMixin: function(obj)
        {
            var name = obj.__name__ || null;
            var info = helpers.processAnnotations(obj);

            // always assume we're operating on a prototype
            var f = function()
            {
                _(info.hash).each(function(fn, key) {

                    // target annotations and mixin annotations
                    var ta       = helpers.findAnnotations(this.constructor, key);
                    var ma       = info.annotations[key];
                    var prettyT  = helpers.prettyPrint(this, key, ta);
                    var targetFn = this[key];

                    // ensure everything checks out
                    mixinMethods.validateFunction(this, key, fn, ta, ma);

                    // figure out what the set and how
                    var val;
                    var descriptor;
                    var thisAnnotations = this.constructor.__annotations__;

                    // trivial case of nothing in the target to worry about
                    if (!targetFn) {
                        thisAnnotations[key] =
                            _(ma).omit(['BEFORE', 'AFTER', 'WRAPPED']);
                        thisAnnotations[key].MIXIN = true;
                        val = fn;

                    } else if (!ma.ABSTRACT && (ma.BEFORE || ma.AFTER || ma.WRAPPED)) {
                        val = mixinMethods.getWrap(this, key, fn, ma);
                        thisAnnotations[key] =
                            _(ta).omit(['BEFORE', 'AFTER', 'WRAPPED']);
                        thisAnnotations[key].AUGMENTED = true;
                    }

                    // assign it
                    helpers.processAccessors(this, key, val, ma);

                }.bind(this));
            };

            f.__name__ = name;
            return f;
        },

        // properly do mixin wrapping on a function
        getWrap: function(proto, key, fn, ma)
        {
            var wrapped = 0;

            if (ma.WRAPPED) {
                wrapped++;
                fn = helpers.wrap(proto[key], fn);

            } else if (ma.BEFORE) {
                wrapped++;
                var beforeFunc = fn;
                fn = helpers.wrap(proto[key], function(f) {
                    beforeFunc.apply(proto, arguments);
                    f.apply(proto, arguments);
                });

            } else if (ma.AFTER) {
                wrapped++;
                var afterFunc = fn;
                fn = helpers.wrap(proto[key], function(f) {
                    f.apply(proto, arguments);
                    afterFunc.apply(proto, arguments);
                });
            } else {
                return;
            }

            if (wrapped > 1)
                throw new Error('Too many augmentation annotations');

            return fn;
        },

        // given a function to mixin, make sure it checks out
        validateFunction: function(target, key, fn, ta, ma)
        {
            var prettyT  = helpers.prettyPrint(target, key, ta);
            var targetFn = target[key];

            // invalid inheritence stuff
            if (ma.VIRTUAL || ma.OVERRIDE || ma.PROPERTY || ma.RESULT || ma.STATIC)
                throw new Error ('Invalid annotation in mixin');

            // Make sure it's either abstract or a function
            if (!ma.ABSTRACT && !_(fn).isFunction())
                throw new Error ('Only functions are valid in mixins');

            // cannot augment on top of base abstract
            if (ta && ta.ABSTRACT && (ma.BEFORE || ma.AFTER || ma.WRAPPED))
                throw new Error('Cannot use augmenting annotation on ' +
                    'top of base abstract member "' + prettyT + '"');

            // if we're augmenting the target, do some sanity checks
            if (targetFn) {
                if (!_(targetFn).isFunction())
                    throw new Error(
                    'Cannot mixin on top of non-function base member "' +
                        prettyT + '"');

                if (ma.NEW)
                    return;

                // must be awknolwedged that we're clobbering
                if (!ma.ABSTRACT && !ma.BEFORE && !ma.AFTER && !ma.WRAPPED)
                    throw new Error ('Must use before, after, or wrapped ' +
                        'annotations when overriding a base member with a mixin');

                // abstract in mixin is emulating the interface pattern, so if
                // we already have it, make sure it matches the targets
                // signature
                if (ma.ABSTRACT)
                    if (!helpers.sameAnnotations(ta, ma, ['ABSTRACT']))
                        throw new Error ('Member annotation signatures ' +
                            'must match when mixing in an abstract member');
            } else {
                if (ma.BEFORE || ma.AFTER || ma.WRAPPED)
                    throw new Error ('Augmentation annotation used when ' +
                        'no base function present');
            }
        }
    };

    return mixinMethods;
});
