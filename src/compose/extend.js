define(function(require, exports, module) {

    var helpers      = require('./helpers');
    var mixinMethods = require('./mixin');

    var extendMethods = {

        // given teh parent, the extend hash, and the annotation info, figure
        // out the constructor
        determineConstructor: function(Parent, obj, info)
        {
            var Child;

            // attempt to find something with an explicit constructor
            var key;
            _(info.annotations).each(function(a,k) {
                if (a.CONSTRUCTOR)
                    key = k;
            });

            // swap the constructor in
            if (key) {
                Child = info.hash[key];
                Child.__name__ = key;
                delete info.annotations[key];
                delete info.hash[key];
            } else if (obj !== undefined && obj.hasOwnProperty('constructor')) {
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
                var name = obj.__name__ || null;

                // figure out what the actuall function will be for the
                // constructor, which will be the basis of the Class
                var Child = extendMethods
                    .determineConstructor(Parent, obj, info);

                // setup prototype chain via a surrogate constructor object,
                // this way we don't actually have to instantiate a Parent, as
                // that may cause side effects
                var ctor = function() {};
                ctor.prototype = Parent.prototype;
                Child.prototype = new ctor();
                helpers.defHidden(Child.prototype, { constructor: Child });

                // cool methods on prototype and actual class
                helpers.setupPrototype(Child.prototype);
                helpers.setupConstructor(Child, Parent, name);

                // process each member of the hash to either add it to the
                // prototype/Class, or what
                _(info.hash).each(function(val, key) {
                    extendMethods.processMember(
                        Child, key, val, info.annotations[key]);
                });

                // if this is an abstract class, then make sure swap
                // constructor etc.
                //
                // EXCEPTION : when obj is empty, meaning we are just copying
                // the class
                if (!_(info.hash).isEmpty() && helpers.isAbstract(Child)) {
                    Child = extendMethods.transformAbstract(Child, info);
                }

                // propigate the extender
                helpers.defHidden(Child, {
                    extend: extendMethods.makeExtend(Child)
                });

                // propigate using
                helpers.defHidden(Child, {
                    using: mixinMethods.makeUsing(Child)
                });

                return Child;
            };
        },

        // do what we gotta do when we encounter an abstract class during
        // extend creation
        transformAbstract: function(Child, info)
        {
            // ensure that all inherited abstract members are
            // re-declared, this is to ensure we didn't accidently
            // create an abstract class by leaving off their defs.
            // Kinda feels non-optimal
            _(Child.getSignature()).each(function(a, key) {

                if (a.ABSTRACT && !info.hash.hasOwnProperty(key))
                    throw new Error('Base abstract member "' + key +
                        '" is not present in child class. ' +
                        'Implement or declare as abstract');

            });

            // if there was a constructor provided in the original
            // hash, that's really bad.
            if (info.hash.hasOwnProperty('constructor'))
                throw new Error('Abstract class cannot have constructor');

            // swap out the constructor for a dummy one to prevent
            // instantiation
            var AbstractClass = function() { throw new Error(
                'Cannot instantiate abstract class'); };

            return helpers.swapConstructor(Child, AbstractClass);
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
            helpers.processAccessors(proto, key, val, annotations);

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

            // ... if the child doesn't indicate an override or an ABSTRACT
            // continuation
            if (!ca.OVERRIDE && !(ca.ABSTRACT && pa.ABSTRACT))
                throw new Error('Child member "' + prettyC +
                    '" needs override annotation when hiding "' + prettyP + '"');

            // Ensure that all non-inheritance annotations are transfered
            if (!helpers.sameAnnotations(ca, pa,
                ['MIXIN', 'AUGMENTED', 'VIRTUAL', 'ABSTRACT', 'OVERRIDE']))
                throw new Error('Base member "' + prettyP + '" and child member "' +
                    prettyC + '" do not have matching annotation signatures');
        }

    };

    return extendMethods;
});
