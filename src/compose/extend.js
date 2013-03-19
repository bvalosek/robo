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
                helpers.defHidden(Child, { prototype: new ctor() });
                helpers.defHidden(Child.prototype, { constructor: Child });

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

            // normal
            Object.defineProperty(proto, key, {
                value: val,
                writable: true,
                enumerable: true, configurable: true
            });

            Child.__annotations__[key] = annotations;

            // don't do any inheritence checks for static
            if (annotations.STATIC)
                return;
        }

    };

    return extendMethods;
});
