define(function(require, exports, module) {

    var _ = require('underscore');

    var helpers = {

        // true if there are any un-implemented abstract methods
        isAbstract: function(Ctor)
        {
            var sig = helpers.getClassSignature(Ctor);
            return !!_(sig).find(function(v,k) { return v.ABSTRACT; });
        },

        // create a function that when called, has 2 arguments: the original fn
        // function, as well as all the arguments passed to it
        wrap: function(fn, wrapper, context)
        {
            return function() {
                return wrapper.call(this,
                    fn.bind(context || this), _(arguments).toArray());
            };
        },

        // swap a constructor function into an existing class. basically rocket
        // surgery. Better hope that Class has not sealed configuration or has
        // any existing members
        swapConstructor: function(Class, ctor)
        {
            var props = Object.getOwnPropertyNames(Class);

            props.forEach(function(key) {
                var desc = Object.getOwnPropertyDescriptor(Class, key);
                Object.defineProperty(ctor, key, desc);
            });

            return ctor;
        },

        // descend to the bottom of the heirachy, building back up, to get a
        // full map of annotations
        getClassSignature: function(Ctor, sig)
        {
            sig = sig || {};

            if (Ctor.Super)
                helpers.getClassSignature(Ctor.Super, sig);

            _(sig).extend(Ctor.__annotations__);
            return sig;
        },

        // pretty print a sig
        prettySig: function(Class)
        {
            var sig = Class.getSignature();

            var s = 'class ' + (Class.__name__ || '?');

            if (Class.Super)
                s+= ' : ' + (Class.Super.__name__ || '?');

            s += ' \n{\n';

            _(sig).each(function(annotations, key) {

                var a = _(annotations).reduce(function(a,x,k) {
                    return a + k + ' ';
                }, '').toLowerCase().trim();

                s += '    ' + (a ? a + ' ' : '') + key;

                var val = Class.prototype[key];

                if (_(val).isFunction()) s += '()';
                else if (_(val).isArray()) s += '[]';
                else if (_(val).isObject()) s += '{}';
                else if (val === undefined && !annotations.ABSTRACT) s += ' = undefined';
                else if (val === null) s += ' = null';

                s += ';\n';

            });

            s += '}';

            return s;
        },

        // give us all the cool stuff on the prototype
        setupPrototype: function(proto)
        {
            // setup instance members
            helpers.defHidden(proto, {
                is         : helpers.is.bind(this, proto)
            });
        },

        // stick on all the appropriate per-type stuff to a constructor
        setupConstructor: function(Ctor, Super, name)
        {
            helpers.defHidden(Ctor, {

                findAnnotations : helpers.findAnnotations.bind(this, Ctor),
                findMembers     : helpers.findMembers.bind(this, Ctor),
                getSignature    : helpers.getClassSignature.bind(this, Ctor),

                // meta properties
                Super           : Super || null,
                parent          : Super ? (Super.prototype) : {},
                __name__        : name || null,
                __annotations__ : {},
                __mixins__      : []

            });

        },

        // given an instance of a class or a constructor, get an array of all
        // mixins and classes used to make this bad boy
        getAllTypes: function(Ctor)
        {
            var types = Ctor.prototype.__mixins__ ?
                _(Ctor.prototype.__mixins__).clone() : [];

            var C = Ctor;
            while (C) {
                types.push(C);
                C = C.Super;
            }

            return types;
        },

        // true of a consttructor had a part in an instance
        is: function(instance, type)
        {
            var types = helpers.getAllTypes(instance.constructor);

            return _(types).contains(type);
        },

        // shortcut for defining hidden stuff
        defHidden: function(obj, key, val)
        {
            // can use a hash instead of a single key val
            var hash = {};
            if (!_(key).isObject())
                hash[key] =  val;
            else
                hash = key;

            _(hash).each(function(val, key) {
                Object.defineProperty(obj, key, {
                    value: val,
                    enumberable: false, writable: false
                });
            });
        },

        // convert an array of strings into an object with key vals
        makeHash: function(strings, value)
        {
            var h = {};
            _(strings).each(function(s) { h[s] = value ? value : s; });
            return h;
        },

        // check the annotation signatures to see if they're the same
        sameAnnotations: function(a1, a2, omits)
        {
            if (omits) {
                a1 = _(a1).omit(omits);
                a2 = _(a2).omit(omits);
            }

            var ka1 = _(a1).keys();
            var ka2 = _(a2).keys();

            var d1 = _(ka1).difference(ka2);
            var d2 = _(ka2).difference(ka1);

            return (d1.length === 0 && d2.length === 0);
        },

        // given a key and a starting object, get the annotations of it from the
        // constructor. This is needed in order to ensure we traverse all the way
        // back to the correct constructor context in order to get the annotations
        // off a member exposed via the prototype
        findAnnotations: function(Class, key)
        {
            if (!Class)
                return;

            var proto = Class.prototype;

            // bingo
            if (proto.hasOwnProperty(key))
                return Class.__annotations__ ? Class.__annotations__[key] : {};

            return helpers.findAnnotations(Class.Super, key);
        },

        // given a class and an annotation string
        findMembers: function(Class, annotation, found)
        {
            found = found || [];

            _(Class.__annotations__).each(function(annos, key) {
                if (annos[annotation])
                    found.push(key);
            });

            // continually build up our list of members we've found with
            // matching annotations
            if (Class.Super)
                return findKeys(Class.Super, annotation, found);
            else
                return _(found).uniq();
        },

        // return both the correct hash and an info object for dealing with
        // annotations
        processAnnotations: function(hash)
        {
            var newHash = {};
            var allAnnotations = {};

            // handle for all elements in the hash
            _(hash).each(function(val, key) {
                var m           = key.toUpperCase().match(/^__([A-Z_]+)__/);
                var annotations = m ? m[1].split('__') : [];
                key             = m ? key.substring(m[0].length) : key;

                // cannot have same key after removing annotations
                if (key != 'constructor' && newHash[key] !== undefined) {
                    throw new Error('duplicate key in hash');
                }

                // build up the return object
                newHash[key]        = val;
                allAnnotations[key] = helpers.makeHash(annotations, true);

            });

            return {
                hash: newHash,
                annotations: allAnnotations
            };
        },

        // nicely outputted member tag, e.g. 'readonly virtual View::render'
        prettyPrint: function(Ctor, key, annotations)
        {
            var s = '';

            s += _(annotations).reduce(function(acc,v,k) {
                return acc + k.toLowerCase() + ' ';
            }, '');

            if (Ctor.__name__)
                s += Ctor.__name__ + '::'; // '
            s += key;

            return s;
        },

        // handle all accessor-type info
        processAccessors: function(proto, key, val, annotations)
        {
            var prettyKey = helpers.prettyPrint(proto.constructor, key, annotations);

            var accessorMods = 0;

            // getters and setters ... accessor stuff
            if (annotations.GET) {
                accessorMods++;
                Object.defineProperty(proto, key, {
                    get: val, set: undefined,
                    enumerable: true, configurable: true
                });
            }

            if (annotations.SET) {
                accessorMods++;
                Object.defineProperty(proto, key, {
                    set: val, get: undefined,
                    enumerable: true, configurable: true
                });
            }

            // result annotation leverages underscore 'result' function
            if (annotations.PROPERTY && annotations.RESULT) {
                accessorMods++;
                var _key = '_' + key;
                proto[_key] = val;
                Object.defineProperty(proto, key, {
                    get: function() { return _(this).result(_key); },
                    set: function(v) { this[_key] = _(v).isFunction() ? v.bind(this) : v; },
                    enumerable: true, configurable: true
                });

            // just property means expect get / set
            } else if (annotations.PROPERTY) {
                accessorMods++;
                Object.defineProperty(proto, key, {
                    get: val.get, set: val.set,
                    enumerable: true, configurable: true
                });
            }

            // throws an error when attempting to write, but at the expense of
            // creating a getter/setting
            if (annotations.CONST) {
                accessorMods++;
                Object.defineProperty(proto, key, {
                    get: function() { return val; },
                    set: function() { throw new Error('Cannot change const member "' +
                        prettyKey + '"'); },
                    enumerable: true, configurable: true
                });
            }

            // if we haven't done any access style yet, then just do it noraml.
            // otherwise flip our shit
            if (accessorMods === 0) {
                Object.defineProperty(proto, key, {
                    value: val,
                    writable: true,
                    enumerable: true, configurable: true
                });
            } else if (accessorMods != 1) {
                throw new Error('Member "' + prettyKey +
                    '" has invalid accessor combination');
            }

            // hide from enumeration
            if (annotations.HIDDEN)
                Object.defineProperty(proto, key, { enumerable: false });

            // read only works if its a normal member with no access stuff
            if (annotations.READONLY && accessorMods !== 0)
                throw new Error('Member "' + prettyKey + '" cannot be readonly');

            // read only proper
            if (annotations.READONLY)
                Object.defineProperty(proto, key, { writable: false });
        }

    };

    return helpers;
});
