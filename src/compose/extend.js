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
            } else {
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
        },

        // handle all accessor-type info
        processAccessors: function(proto, key, val, annotations)
        {
            var prettyKey = helpers.prettyPrint(proto.constructor, key, annotations);

            // getters and setters ... accessor stuff
            if (annotations.GET) {
                Object.defineProperty(proto, key, {
                    get: val, set: undefined,
                    enumerable: true, configurable: true
                });
            } else if (annotations.SET) {
                Object.defineProperty(proto, key, {
                    set: val, get: undefined,
                    enumerable: true, configurable: true
                });

            // result annotation leverages underscore 'result' function
            } else if (annotations.PROPERTY && annotations.RESULT) {
                var _key = '_' + key;
                proto[_key] = val;
                Object.defineProperty(proto, key, {
                    get: function() { return _(this).result(_key); },
                    set: function(v) { this[_key] = _(v).isFunction() ? v.bind(this) : v; },
                    enumerable: true, configurable: true
                });

            // just property means expect get / set
            } else if (annotations.PROPERTY) {
                Object.defineProperty(proto, key, {
                    get: val.get, set: val.set,
                    enumerable: true, configurable: true
                });

            // throws an error when attempting to write, but at the expense of
            // creating a getter/setting
            } else if (annotations.CONST) {
                Object.defineProperty(proto, key, {
                    get: function() { return val; },
                    set: function() { throw new Error('Cannot change const member "' +
                        prettyKey + '"'); },
                    enumerable: true, configurable: true
                });

            // normal
            } else {
                Object.defineProperty(proto, key, {
                    value: val,
                    writable: true,
                    enumerable: true, configurable: true
                });
            }

            // hide from enumeration
            if (annotations.HIDDEN)
                Object.defineProperty(proto, key, { enumerable: false });

            // read only
            if (annotations.READONLY)
                Object.defineProperty(proto, key, { writable: false });
        }

    };

    return extendMethods;
});
