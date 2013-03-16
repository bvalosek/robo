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
            return wrapper.call(this, fn.bind(context || this), _(arguments).toArray());
        };
    };

    // Given some constructor function Parent, return a function that extends
    // itself
    var makeExtender = function(Parent)
    {
        return function(Child)
        {
            var proto;
            var statics = [];
            var info = {};

            // if passing in a hash instead of a function, assume it's the
            // stuff we want hanging off the prototype + constructor
            if (Child && !_(Child).isFunction()) {
                info = processAnnotations(Child);

                // prototype so far is the de-annotated version of the hash
                proto = _(info.hash).omit('constructor');

                // constructor function if we've got one
                Child = Child.hasOwnProperty('constructor') ?
                    Child.constructor : null;
            }

            // by default child calls parent constructor
            Child = Child || function() {
                return Parent.apply(this, arguments);
            };

            // stash them annotations
            Child.__annotations__ = info.annotations;

            // setup proto chain via a surrogate object
            var ctor = function() {};
            ctor.prototype = Parent.prototype;
            Child.prototype = new ctor();
            Child.prototype.constructor = Child;

            // copy all of the stuff from our current proto hash onto the
            // actual Child prototype
            if (proto)
                _(Child.prototype).extend(proto);

            // create a mixin function on the new class
            Child.mixin = function() {
                return includeMixin(Child, _(arguments).toArray());
            };

            // nice.
            Child.Super = Parent;

            // check parent overrides parent/child modifiers
            _(Child.prototype).each(function(fn, key) {
                if (key != 'constructor')
                    handleAnnotations(
                        // classes so far
                        Parent, Child, key,

                        // the members
                        Parent.prototype[key], fn,

                        // the annotation information
                        Parent.prototype[key] ? Parent.prototype[key].__annotations__ : null,
                        info.annotations[key]);
            });

            // propigate extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    // given a Parent, Child, pm, cm .. and their annotations, do stuff
    var handleAnnotations = function(Parent, Child, key, pm, cm, pa, ca)
    {
        // don't care if no annotations
        if (_(pa).isEmpty() && _(ca).isEmpty())
            return;

        console.log('handling', key, ca, ' -> ', pa);

        // basic function mutators
        if (_(cm).isFunction()) {

            if (ca.GET) {
                Object.defineProperty(Child.prototype, key, {
                    get: cm,
                    enumerable: true
                });

            } else if (ca.SET) {
                Object.defineProperty(Child.prototype, key, {
                    set: cm
                    enumerable: true
                });
            }

        // hash mutations
        } else if (_(cm).isObject()) {

            if (ca.PROPERTY) {
                Object.defineProperty(Child.prototype, key, {
                    get: cm.get,
                    set: cm.set
                    enumerable: true
                });
            }
        }

        // general mutations
        if (ca.READONLY) {
            Object.defineProperty(Child.prototype, key, {
                writable: false
                enumerable: true
            });
        }
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
        wrap        : wrap,
        createMixin : createMixin
    };
});
