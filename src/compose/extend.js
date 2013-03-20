define(function(require, exports, module) {

    var helpers = require('./helpers');

    var extendMethods = {

        // given teh parent, the extend hash, and the annotation info, figure
        // out the constructor
        determineConstructor: function(Parent, obj, info)
        {
            var Child;

            if (obj !== undefined && obj.hasOwnProperty('constructor')) {
                Child = obj.constructor;
            } else if (helpers.isAbstract(Parent)) {
                Child = function() {};
            } else {
                // need to make sure and instantiate a new constructor as to
                // not leak the prototype etc
                Child = function() { return Parent.apply(this, arguments); };
            }

            return Child;
        },

        // given a Parent constructor, return a function that takes a hash and
        // correctly creates a new subclass
        makeExtend: function(Parent)
        {
            return function(obj)
            {
                obj      = obj || {};
                var info = helpers.processAnnotations(obj);
                var name = null;

                var Child = extendMethods
                    .determineConstructor(Parent, obj, info);

                // setup prototype chain via a surrogate constructor object,
                // this way we don't actually have to instantiate a Parent, as
                // that may cause side effects
                var ctor = function() {};
                ctor.prototype = Parent.prototype;
                Child.prototype = new ctor();
                Child.prototype.constructor = Child;

                // meta info on constructor
                helpers.setupConstructor(Child, Parent, name);

                // process each member of the hash to either add it to the
                // prototype/Class, or what
                _(info.hash).each(function(val, key) {
                    extendMethods.processMember(
                        Child, key, val, info.annotations[key]);
                });

                if (helpers.isAbstract(Child)) {

                    // if there was a constructor provided in the original
                    // hash, that's really bad.
                    if (info.hash.hasOwnProperty('constructor'))
                        throw new Error('Abstract class cannot have constructor');

                    // swap out the constructor for a dummy one to prevent
                    // instantiation
                    var AbstractClass = function() { throw new Error(
                        'Cannot instantiate abstract class'); };
                    Child = helpers.swapConstructor(Child, AbstractClass);
                }

                // propigate the extender
                helpers.defHidden(Child, {
                    extend: extendMethods.makeExtend(Child)
                });

                return Child;
            };
        },

        processMember: function(Child, key, val, annotations)
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

            // check out the annotations etc
            extendMethods.processAccessors(proto, key, val, annotations);

            // ensure we keep track of the annotations
            Child.__annotations__[key] = annotations;

            // don't do any inheritence checks for static
            if (annotations.STATIC)
                return;

            // handle the inheritance annotations
            extendMethods.processInheritance(Child, key, val, annotations);
        },

        processInheritance: function(Child, key, val, annotations)
        {
            var ca      = annotations;
            var pa      = helpers.findAnnotations(Child.Super, key);
            var prettyC = helpers.prettyPrint(Child, key, annotations);
            var prettyP = helpers.prettyPrint(Child.Super, key, pa);

            // override without a parent
            if (ca.OVERRIDE && pa === undefined)
                throw new Error('Member "' + prettyC +
                    '" does not override a base member');

            // no parent method -> done
            if (pa === undefined)
                return;

            // ... if sealed, nothing can let us override!
            if (pa.SEALED)
                throw new Error('Member "' + prettyC +
                    '" cannot override "' + prettyP + '"');

            // ... if new, we can do whatever we want
            if (ca.NEW)
                return;

            // ... if the parent isnt inheritable, then die
            if (!pa.VIRTUAL && !pa.ABSTRACT && !pa.OVERRIDE)
                throw new Error('Hidden base member "' + prettyP +
                    '" cannot be overriden. Use virtual or abstract.');

            // abstract means we
            if (ca.ABSTRACT && !pa.ABSTRACT)
                throw new Error('Base member "' + prettyP +
                    '" cannot be hidden by non-abstract member "' + prettyC + '"');

            // ... if the child doesn't indicate an override
            if (!ca.OVERRIDE)
                throw new Error('Child member "' + prettyC +
                    '" needs override annotation when hiding "' + prettyP + '"');

            // Ensure that all non-inheritance annotations are transfered
            if (!helpers.sameAnnotations(ca, pa, ['VIRTUAL', 'ABSTRACT', 'OVERRIDE']))
                throw new Error('Base member "' + prettyP + '" and child member "' +
                    prettyC + '" do not have matching annotation signatures');
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

    return extendMethods;
});
