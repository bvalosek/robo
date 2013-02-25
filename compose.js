define(function(require, exports, module) {

    var _ = require('underscore');

    // mixin the functionality of m into a
    var mixinSingle = function(a, m)
    {
        if (a._mixins) {

            // if we're mixing into something that only has _mixins in its
            // prototype chain, give it its own
            if (!a.hasOwnProperty('_mixins')) {
                a._mixins = _(a._mixins).clone();
            }

            // only add this mixin if we don't have it already
            if (~a._mixins.indexOf(m))
                return;
            else
                a._mixins.push(m);

        } else {
            a._mixins = [m];
        }

        // do it
        m.call(a);
    };

    // mixin "functional mixins" in the mixins array, into a
    var mixin = function(a, mixins)
    {
        if (_(mixins).isFunction())
            mixins = [mixins];

        mixins.push(withCompose);

        _(mixins).each(function(mixin) {
            mixinSingle(a, mixin);
        });

        return a;
    };

    // create a function that when called, has 2 arguments: the original fn
    // function, as well as all the arguments passed to it
    var wrap = function(fn, wrapper)
    {
        return function() {
            return wrapper.call(this, fn.bind(this), _(arguments).toArray());
        };
    };

    var makeExtender = function(Parent)
    {
        return function(Child)
        {
            var proto;

            // if passing in a hash instead of a function, assume it's the
            // stuff we want hanging off the prototype + constructor
            if (Child && !_(Child).isFunction()) {
                proto = _(Child).omit('constructor');
                Child = Child.constructor;
            }

            // by default child calls parent constructor
            Child = Child || function() {
                return Parent.apply(this, arguments);
            };

            // setup proto chain
            var ctor = function() {};
            ctor.prototype = Parent.prototype;
            Child.prototype = new ctor();
            Child.prototype.constructor = Child;

            // proto style
            if (proto)
                _(Child.prototype).extend(proto);

            // nice.
            Child.Super = Parent;

            // dat mixin
            Child.mixin = function() {
                mixin(Child.prototype, _(arguments).toArray());
                return Child;
            };

            // propagate extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    // return as a new constructor function ("class") that is subclass of
    // Parent, a la classical inheritance
    var extend = function(Parent, Child)
    {
        return makeExtender(Parent)(Child);
    };

    // self mixin
    var withCompose = function()
    {
        // could be overwritten below if we're a constructor
        this.mixin = function(m) { return mixin(this, _(arguments).toArray()); };

        // if we've got a constructor, go ahead and do it a solid by chaining
        // the extend method
        if (this.constructor) {
            this.constructor.extend = makeExtender(this.constructor);

            // let mixin function like this
            this.constructor.mixin = function() {
                return this.extend().mixin.apply(this, arguments);
            };
        }

    };

    return {
        withCompose : withCompose,
        extend      : extend,
        mixin       : mixin,
        wrap        : wrap
    };
});
