define(function(require, exports, module) {

    var _       = require('underscore');
    var helpers = require('./helpers');

    // return both the correct hash and an info object for dealing with
    // annotations in a key/value hash
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

        });

        return {
            hash: newHash,
            annotations: allAnnotations
        };
    };


    // attempt to find the annotation info for a hash. WIll only work if its an
    // object created by a compose.js constructor (via extend, etc). Depds on
    // the meta information hanging off the constructor
    var annotationsFromThis = function(obj)
    {
        if (obj && obj.constructor && obj.constructor.__annotations__)
            return obj.constructor.__annotations__;

        return {};
    };

    // Functional mixin -- mixin the functionality of m into a
    // inspired by:
    // http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
    // also keep track with a _mixin key to prevent multi-mix
    var mixinSingle = function(a, m)
    {
        if (a._mixins) {

            // if we're mixing into something that only has _mixins in its
            // prototype chain, give it its own
            if (!a.hasOwnProperty('_mixins')) {
                Object.defineProperty(a, '_mixins', {
                    value: _(a._mixins).clone(),
                    enumberable: false, writable: false
                });
            }

            // only add this mixin if we don't have it already
            if (~a._mixins.indexOf(m))
                return;
            else
                a._mixins.push(m);

        } else {
            Object.defineProperty(a, '_mixins', {
                value: [m],
                enumberable: false, writable: false
            });
        }

        // do it
        m.call(a);
    };

    // create a "functional mixin" from a hash of stuff
    var createMixin = function(hash)
    {
        var info = processAnnotations(hash);

        return function() {
            _(info.hash).each(function(fn, key) {

                if (!_(fn).isFunction())
                    throw new Error ('Only functions are valid in mixins');

                // if we're hiding any functions in the target class
                var originalFunction = this[key];
                if (originalFunction) {
                    if (!_(originalFunction).isFunction())
                        throw new Error('Mixin function cannot conflict with non-function base member');

                    var ca = info.annotations[key] || {};
                    var pa = annotationsFromThis(this)[key];

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

        // get w/ compose for free!
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

    // give a Parent constructor an extend function that is used for inheritence
    var makeExtender = function(Parent)
    {
        return function(obj)
        {
            obj = obj || {};

            // determine what the actual constructor is going to be, if we have
            // it in the hash, etc
            var Child;
            if (obj !== undefined && _(obj).isObject()
                && obj.hasOwnProperty('constructor'))  {
                    Child = obj.constructor;
            } else {
                if (!Parent.__ABSTRACT__)
                    Child = function() {
                        return Parent.apply(this, arguments);
                    };
                else
                    Child = function() {};
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

            // now deal with all the stuff we have in the descriptor hash, and
            // store it on the constructor for later fun
            var info = processAnnotations(obj);

            // if there are any abstract members, this is an abstract class, so
            // kill the constructor by preventing instantiating
            var abstractMember = _(info.annotations).find(function(val, key) {
                return val.ABSTRACT;
            });

            if (abstractMember) {
                if (obj.hasOwnProperty('constructor'))
                    throw new Error('Cannot have constructor in abstract class');

                // make new fake constructor
                var p = Child.prototype; var S = Child.Super;
                Child = function() {
                    throw new Error('Cannot instantiate abstract class');
                };

                Child.__ABSTRACT__ = true;
                Child.prototype    = p;
                Child.Super        = S;
            }

            // attach meta information to the constructor for later
            Object.defineProperty(Child, '__annotations__', {
                enumerable: false, writable: false, value: info.annotations
            });

            _(info.hash).each(function(val, key) {
                var annotations = info.annotations[key];

                // inject the member into the prototype
                processMember(Child, key, val, annotations);
            });

            // check for any non-implemented abstract members. This has to be a
            // static/load-time check otherwise there will be overrhead with
            // every function call
            if (!Child.__ABSTRACT__)
                _(Parent.prototype).each(function(val, key)  {
                    var pa = findAnnotations(Parent, key);
                    var ca = info.annotations[key] || {};

                    if (!pa)
                        return;

                    if (!pa.ABSTRACT)
                        return;

                    if (!ca.OVERRIDE && !ca.ABSTRACT && !ca.NEW)
                        throw new Error('Non-abstract child class must define abstract base member "' + key + '"');
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
        Child, key, val, annotations, parentVal, parentAnnotations)
    {
        if (key === 'constructor')
            return;

        // if this is a static member, we're operating on the actual
        // constructor object/function and not the prototype hash
        var proto;
        if (annotations.STATIC)
            proto = Child;
        else
            proto = Child.prototype;

        // getters and setters ... accessor stuff
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

            // result leverages udnerscores result method
            if (annotations.RESULT)  {
                var _key = '_' + key;
                proto[_key] = val;
                Object.defineProperty(proto, key, {
                    get: function() { return _(this).result(_key); },
                    set: function(v) { this[_key] = _(v).isFunction() ? v.bind(this) : v; },
                    enumerable: true, configurable: true
                });

            // otherwise expect get and set properties
            } else {
                Object.defineProperty(proto, key, {
                    get: val.get,
                    set: val.set,
                    enumerable: true, configurable: true
                });
            }

        // more overhead, but throw error when trying to set
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

        // hide from enumeration
        if (annotations.HIDDEN)
            Object.defineProperty(proto, key, { enumerable: false });

        // read only
        if (annotations.READONLY)
            Object.defineProperty(proto, key, { writable: false });

        // if it's static, we're done here (no inheritance)
        if (annotations.STATIC)
            return;

        // inheritance. at this point, the member is on the Child prototype, we
        // need to check on what the deal is with any member we may be hiding
        // down the prototype chain
        var parentAnnotations = findAnnotations(Child.Super, key);

        // member not on parent
        if (parentAnnotations === undefined)
            return;

        var pa = parentAnnotations; var ca = annotations;

        // if its new, doesnt matter what's going on below, disregard all
        if (ca.NEW)
            return;

        if (!pa.ABSTRACT && !pa.VIRTUAL && !pa.OVERRIDE)
            throw new Error('Hidden base member must be virtual or abstract');

        if (!ca.OVERRIDE)
            throw new Error('Must use override annotation when hiding base virtual or abstract member "' + key + '"');
    };

    // given a key and a starting object, get the annotations of it from the
    // constructor. This is needed in order to ensure we traverse all the way
    // back to the correct constructor context in order to get the annotations
    // off a member exposed via the prototype
    var findAnnotations = function(Class, key)
    {
        if (!Class)
            return;

        var proto = Class.prototype;

        if (proto.hasOwnProperty(key))
            return Class.__annotations__ ? Class.__annotations__[key] : {};

        return findAnnotations(Class.Super, key);
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
        Object.defineProperty(this, 'mixin', {
            value: function(m) { return mixin(this, _(arguments).toArray()); },
            enumerable: false
        });

        // if we've got a constructor, go ahead and do it a solid by chaining
        // the extend method
        if (this.constructor) {
            Object.defineProperty(this.constructor, 'extend', {
                value: makeExtender(this.constructor),
                enumerable: false
            });

            var m = function() {
                return includeMixin(this, _(arguments).toArray());
            }.bind(this.constructor);

            Object.defineProperty(this.constructor, 'mixin', {
                value: m,
                enumerable: false
            });
        }
    };

    var Base = function() {};
    mixin(Base.prototype, withCompose);

    return {
        withCompose : withCompose,
        extend      : extend,
        mixin       : mixin,
        createMixin : createMixin,
        Base        : Base
    };
});
