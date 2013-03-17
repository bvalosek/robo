define(function(require, exports, module) {

    var _       = require('underscore');
    var helpers = require('./helpers');

    // return both the correct hash and an info object for dealing with
    // annotations in a key/value hash, and also hang meta info off of objects
    // in the actual hash
    var processAnnotations = function(hash)
    {
        var newHash = {};
        var allAnnotations = {};

        // handle for all elements in the hash
        _(hash).each(function(val, key) {
            var m           = key.toUpperCase().match(/^__([A-Z_]+)__/);
            var annotations = m ? m[1].split('__') : [];
            key             = m ? key.substring(m[0].length) : key;

            // cannot have same key
            if (key != 'constructor' && newHash[key] !== undefined) {
                throw new Error('Duplicate member found: ' + key);
            }

            // build up return object
            newHash[key]     = val;

            // set the flags on the info
            allAnnotations[key] = helpers.makeHash(annotations, true);

            // add in meta information if we can hang stuff off
            if(annotations.length && _(val).isObject()) {
                val.__annotations__ = helpers.makeHash(annotations, true);

                annotations.forEach(function(a) {
                    val['__' + a + '__'] = true;
                });
            }

        });

        return {
            hash: newHash,
            annotations: allAnnotations
        };
    };

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

    // create a functional mixin from a hash of stuff with a magically WRAP
    // ability as an annotation
    var createMixin = function(hash)
    {
        var info = processAnnotations(hash);

        return function() {
            _(info.hash).each(function(fn, key) {

                var originalFunction = this[key];

                if (!_(fn).isFunction())
                    throw new Error ('Only functions are valid in mixins');

                // check when hiding
                if (originalFunction) {
                    if (!_(originalFunction).isFunction())
                        throw new Error('Mixin function cannot conflict with non-function base member');

                    var ca = info.annotations[key] || {};
                    var pa = originalFunction.__annotations__ || {};

                    if (ca.NEW) {
                        // who cares if new
                    } else {
                        if (!ca.AFTER && !ca.BEFORE && !ca.WRAPPED)
                            throw new Error ('Must use before, after, or wrapped annotations when overriding a base member with a mixin');
                    }
                }

                var annotations = info.annotations[key];

                // DAT WRAPPING
                if (annotations.WRAPPED) {
                    fn = wrap(this[key], fn);

                } else if (annotations.BEFORE) {
                    var beforeFunc = fn;
                    fn = wrap(this[key], function(f) {
                        beforeFunc.apply(this, arguments);
                        f.apply(this, arguments);
                    });

                } else if (annotations.AFTER) {
                    var afterFunc = fn;
                    fn = wrap(this[key], function(f) {
                        f.apply(this, arguments);
                        afterFunc.apply(this, arguments);
                    });
                }

                // MIX IT IN!
                this[key] = fn;

            }.bind(this));
        };
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
    var wrap = function(fn, wrapper, context)
    {
        return function() {
            return wrapper.call(this,
                fn.bind(context || this), _(arguments).toArray());
        };
    };

    var makeExtender = function(Parent)
    {
        return function(obj)
        {
            obj = obj || {};

            // create constructor function
            var Child;
            if (obj !== undefined && _(obj).isObject()
                && obj.hasOwnProperty('constructor'))  {
                    Child = obj.constructor;
            } else {
                Child = function() {
                    return Parent.apply(this, arguments);
                };
            }

            // setup prototype chain via a surrogate constructor object, this
            // way we don't actually have to instantiate a Parent, as that may
            // cause side effects
            var ctor = function() {};
            ctor.prototype = Parent.prototype;
            Child.prototype = new ctor();
            Child.prototype.constructor = Child;

            // nice.
            Child.Super = Parent;

            // now deal with all the stuff we have in the descriptor hash
            var info = processAnnotations(obj);
            _(info.hash).each(function(val, key) {
                var annotations = info.annotations[key];

                var parentVal, parentAnnotations;

                // inject the member into the prototype
                processMember(
                    Child.prototype, key, val,
                    annotations, parentVal, parentAnnotations);
            });

            // create a mixin object on the Child constructor
            Child.mixin = function() {
                return includeMixin(Child, _(arguments).toArray());
            };

            // propigate the extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    // process a member taking into account the annotations
    var processMember = function(
        proto, key, val, annotations, parentVal, parentAnnotations)
    {
        if (key === 'constructor')
            return undefined;

        // getters and setters
        if (annotations.GET)
            Object.defineProperty(proto, key, {
                get: val,
                enumerable: true, configurable: true
            });
        else if (annotations.SET)
            Object.defineProperty(proto, key, {
                set: val,
                enumerable: true, configurable: true
            });
        else if (annotations.PROPERTY)
            Object.defineProperty(proto, key, {
                get: val.get,
                set: val.set,
                enumerable: true, configurable: true
            });
        else if (annotations.CONST)
            Object.defineProperty(proto, key, {
                get: function() { return val; },
                set: function() { throw new Error('Cannot change const member'); },
                enumerable: true, configurable: true
            });
        else
            Object.defineProperty(proto, key, {
                value: val,
                writable: true,
                enumerable: true, configurable: true
            });

        // hide
        if (annotations.HIDDEN)
            Object.defineProperty(proto, key, { enumerable: false });

        // read only
        if (annotations.READONLY)
            Object.defineProperty(proto, key, { writable: false });

        // inheritance.


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

    var Base = function() {};
    mixin(Base.prototype, withCompose);

    return {
        withCompose : withCompose,
        extend      : extend,
        mixin       : mixin,
        wrap        : wrap,
        createMixin : createMixin,
        Base        : Base
    };
});
