define(function(require, exports, module) {

    var compose       = require('./compose');
    var BackboneModel = require('./backbone/Model');
    var Collection    = require('./Collection');
    var _             = require('underscore');

    var Model = BackboneModel.extend({

        __virtual__urlRoot: null,

        __constructor__Model: function(obj)
        {
            Model.Super.apply(this, arguments);

            // check for any view events to bizzzzind
            _(this.constructor.__annotations__).each(function(a, key) {
                if(a.ATTRIBUTE) {
                    this.addAttribute(key, this[key], a);
                }
            }.bind(this));

            if (obj)
                this.setAttributes(obj);

        },

        // Static class let's us make collections via model classes
        __static__Collection: Collection,

        setAttributes: function(obj)
        {
            _(obj).each(function(val, key) {
                this.addAttribute(key, val);
            }.bind(this));
        },

        // setup observationable attributes
        addAttribute: function(key, initVal, annotations)
        {

            // if it is already setup, then just update
            if (this[key] === this.attributes[key]) {
                this[key] = initVal;
                return;
            }


            var setter;
            if (annotations && annotations.READONLY)
                setter = undefined;
            else if (annotations && annotations.CONST)
                setter = function() { throw new Error('Cannot change const attribute in Model'); };
            else
                setter = function(val) { this.set(key, val); };

            // dont actually put it into attributes if its hidden
            var actualKey = key;
            if (annotations && annotations.HIDDEN) {
                actualKey = '_' + key;
            } else {
                this.attributes[key] = initVal;
            }

            Object.defineProperty(this, key, {
                get: function() { return this.get(actualKey); },
                set: setter,
                enumerable: true
            });
        }

    });

    // have to create our own extender to ensure the Collection object also
    // gets extended
    var makeExtender = function(Parent)
    {
        var extender = Parent.extend;
        var Collection = Parent.Collection;

        return function(obj) {
            var Child = extender.apply(this, arguments);

            obj = obj || {};

            var cHash = _(obj.Collection || {}).extend({
                __override__url: obj.urlRoot || '',
                __override__model: Child
            });

            Child.Collection = Collection.extend(cHash);

            Object.defineProperty(Child, 'extend', {
                value: makeExtender(Child),
                writable: false, configurable: true
            });

            return Child;
        };
    };

    // prime the first extender
    Object.defineProperty(Model, 'extend', {
        value: makeExtender(Model),
        writable: false, configurable: true
    });

    return Model;
});
