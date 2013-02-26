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

    // Given some constructor function Parent, return a function that extends
    // itself
    var makeExtender = function(Parent)
    {
        return function(Child)
        {
            var proto;

            // if passing in a hash instead of a function, assume it's the
            // stuff we want hanging off the prototype + constructor
            if (Child && !_(Child).isFunction()) {
                proto = _(Child).omit('constructor');
                Child = Child.hasOwnProperty('constructor') ?
                    Child.constructor : null;
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

            // create a mixin function on the new class
            Child.mixin = function() {
                return includeMixin(Child, _(arguments).toArray());
            };

            // nice.
            Child.Super = Parent;

            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    // mixin that targets a class, making sure to call an empty extend to get a
    // new proto and not clobber the base
    var includeMixin = function(Base, mixinArgs)
    {
        var M = Base.extend();
        mixin(M.prototype, mixinArgs);
        return M;
    };

    // return as a new constructor function ("class") that is subclass of
    // Parent, a la classical inheritance
    var extend = function(Parent, Child)
    {
        return makeExtender(Parent)(Child);
    };

    // seed mixin -- only used to setup the Base object more than likely
    var withCompose = function()
    {
        // could be overwritten below if we're a constructor
        this.mixin = function(m) { return mixin(this, _(arguments).toArray()); };

        // if we've got a constructor, go ahead and do it a solid by chaining
        // the extend method
        if (this.constructor) {
            this.constructor.extend = makeExtender(this.constructor);

            this.constructor.mixin = function() {
                return includeMixin(this, _(arguments).toArray());
            }.bind(this.constructor);
        }

    };

    return {
        withCompose : withCompose,
        extend      : extend,
        mixin       : mixin,
        wrap        : wrap
    };
});
