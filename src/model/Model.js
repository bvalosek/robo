define(function(require, exports, module) {

    var BackboneModel = require('../backbone/Model');
    var Collection    = require('./Collection');
    var _             = require('underscore');
    var compose       = require('compose');

    var Model = BackboneModel.extend({

        __virtual__urlRoot: null,

        __constructor__Model: function(obj)
        {
            Model.Super.apply(this, arguments);

            // create initial attributes
            _(this.constructor.__annotations__).each(function(a, key) {
                if(!a.PROPIGATE && a.ATTRIBUTE) {
                    this.addAttribute(key, this[key], a);
                }
            }.bind(this));

            if (obj)
                this.setAttributes(obj);
        },

        // set up any event propigation
        __processMember__: function(Child, key, val, annotations)
        {
            if (!annotations.PROPIGATE)
                return;

            // setup getter/setter for propigate
            var _key = '_' + key;
            compose.defineHidden(Child, _key, val);

            Object.defineProperty(Child.prototype, key, {
                get: function() { return this[_key]; },

                set:  function(v) {
                    if (v === this[_key])
                        return;

                    // unbind exisiting
                    if (this[_key] && this[_key].off)
                        this.stopListening(this[_key]);

                    // define attribute to peek into model
                    Object.defineProperty(this.attributes, key, {
                        get: function() { return v.toJSON ? v.toJSON() : v; },
                        enumerable: true, configurable: true
                    });

                    // pipe all events to parents namespaced to this key
                    if (v && v.on) {
                        this.listenTo(v, 'all', function(e) {
                            this.trigger('change:' + key + ':' + e);

                            // the typical messages if we get to the root
                            // change event
                            if (e.indexOf(':') == -1) {
                                this.trigger('change');
                                this.trigger('change:' + key);
                            }
                        }.bind(this));
                    }

                    // ensure we also trigger a change event for this member
                    // when actually setting the propigate
                    this[_key] = v;
                    this.trigger('change');
                    this.trigger('change:' + key);
                }, enumerable: true, configurable: true
            });
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
                this.set(key, initVal);
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
