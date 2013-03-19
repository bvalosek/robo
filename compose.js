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

            // This may be undefined if we're not mixing into a constructor
            var targetAnnotations = this.constructor ?
                this.constructor.__annotations__ : undefined;

            _(info.hash).each(function(fn, key) {

                var ma = info.annotations[key] || {};
                var ta = annotationsFromThis(this)[key];

                // Make sure it's either abstract or a function
                if (!ma.ABSTRACT && !_(fn).isFunction())
                    throw new Error ('Only functions are valid in mixins');

                // if we're hiding any functions in the target class
                var originalFunction = this[key];
                if (originalFunction) {
                    if (!_(originalFunction).isFunction())
                        throw new Error('Mixin function cannot override non-function base member');

                    if (ma.NEW) {
                        // who cares if new
                    } else {
                        if (!ma.AFTER && !ma.BEFORE && !ma.WRAPPED)
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

                // If we're mixing into a constructor, make sure to map all the
                // annotations if we don't yet have the function, or check that
                // all the correct annotations are there.
                if (targetAnnotations !== undefined) {
                    var dump = _(ma).omit(['WRAPPED', 'BEFORE', 'AFTER']);

                    // trivial case of when the mixin function isn't in the target
                    if (!_(dump).isEmpty() && targetAnnotations[key] === undefined) {
                        console.log(targetAnnotations);
                        targetAnnotations[key] = dump;
                    } else if (!_(dump).isEmpty()) {
                        throw new Error('not implemented');
                    }
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
            if (obj !== undefined && _(obj).isObject() &&
                obj.hasOwnProperty('constructor'))  {
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

            // now deal with all the stuff we have in the descriptor hash, and
            // store it on the constructor for later fun
            var info = processAnnotations(obj);

            // if we have a constructor annnotation, setup a tag constant
            var cName;
            var hasCtor = _(info.annotations).find(function(v,k) { cName = k; return v.CONSTRUCTOR; });

            if (hasCtor) {
                // needs to be generalized
                var C = info.hash[cName];
                C.prototype = Child.prototype;
                C.prototype.constructor = C;
                C.__name__ = cName;
                Child = C;
            }

            // if there are any abstract members, this is an abstract class, so
            // kill the constructor by preventing instantiating
            var abstractMember = _(info.annotations).find(function(val, key) {
                return val.ABSTRACT;
            });

            if (abstractMember) {
                if (obj.hasOwnProperty('constructor'))
                    throw new Error('Cannot have constructor in abstract class');

                // make new fake constructor
                var p = Child.prototype;
                Child = function() {
                    throw new Error('Cannot instantiate abstract class');
                };

                Child.__ABSTRACT__ = true;
                Child.prototype    = p;
            }

            // nice.
            Child.Super = Parent;

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
                        throw new Error('Non-abstract child class must define abstract base member "' +
                            prettyPrint(Parent, key, pa) + '"');
                });

            // create a mixin object on the Child constructor
            Child.mixin = function() {
                return includeMixin(Child, _(arguments).toArray());
            };

            // annotation helpers
            Object.defineProperty(Child, 'findAnnotations', {
                value: function(k) { return findAnnotations(Child, k); },
                enumberable: false
            });
            Object.defineProperty(Child, 'findKeys', {
                value: function(a) { return findKeys(Child, a); },
                enumberable: false
            });

            // propigate the extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    // process a member taking into account the annotations
    var processMember = function(Child, key, val, annotations)
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
                set: function() { throw new Error('Cannot change const member "' +
                    prettyPrint(Child, key, annotations) + '"'); },
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
            throw new Error('Hidden base member "' + prettyPrint(Child.Super, key, pa) + '", masked by "' +
                    prettyPrint(Child, key, ca) + '" must be virtual or abstract');

        if (!ca.OVERRIDE)
            throw new Error('Must use override annotation when hiding base virtual or abstract member "' + key + '"');

        // check the annotations to make sure all of them are carried forward.
        // We already know the override/vritual/abstract is correct so omit
        // those
        var omits = ['OVERRIDE', 'VIRTUAL', 'ABSTRACT', 'NEW'];
        var cao = _(ca).omit(omits);
        var pao = _(pa).omit(omits);
        var cd = _(cao).difference(pao);
        var pd = _(pao).difference(cao);
        if (cd.length != pd.length != 0)
            throw new Error ('Override member must have same annotation signature as base class: "' +
                prettyPrint(Child.Super, key, pa) + '"');
    };

    var prettyPrint = function(Ctor, key, annotations)
    {
        var s = '';

        s += _(annotations).reduce(function(acc,v,k) {
            return acc + k.toLowerCase() + ' ';
        }, '');

        if (Ctor.__name__)
            s += Ctor.__name__ + '::'; // '
        s += key;

        return s;
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

    // give a constrcutor and an annotation, find al lthe keys that have it
    var findKeys = function(Class, annotation, found)
    {
        found = found || [];

        _(Class.__annotations__).each(function(annos, key) {
            if (annos[annotation])
                found.push(key);
        });

        if (Class.Super)
            return findKeys(Class.Super, annotation, found);
        else
            return _(found).uniq();

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
            var Ctor = this.constructor;

            // extend
            Object.defineProperty(Ctor, 'extend', {
                value: makeExtender(Ctor),
                enumerable: false
            });


            // empty annotations
            if (Ctor.__annotations__ === undefined)
                Ctor.__annotations__ = {};

            // mixin
            Object.defineProperty(this.constructor, 'mixin', {
                value: function() { return includeMixin(Ctor, _(arguments).toArray()); },
                enumerable: false
            });
        }
    };

    // Base object contains all the fun stuff from compose.js
    var Base = function() {};
    mixin(Base.prototype, withCompose);

    var defineClass = function(obj)
    {
        return Base.extend(obj);
    };

    var defineMixin = createMixin;

    return {

        // should be primary use of compose.js
        defineMixin : defineMixin,
        defineClass : defineClass,

        // using conpose.js on existing objects
        withCompose : withCompose,
        mixin       : mixin
    };
});
