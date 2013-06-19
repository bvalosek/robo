define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');
    var Log        = require('robo/util/Log');

    // A proxy object that can install a getter/setter in another object that
    // will dynamically reflect whatever source is set. In addition, change
    // events can be listened to
    return compose.class('Observable').uses(WithEvents).define({

        // Provide reference to a model and subsequent attribte on which we
        // provide the value and proxy events from
        model     : null,
        attribute : null,

        // By default, just use a dumb value
        value: null,

        // Fetching what we're storing
        __property__value: {
            get: function() { return this.getValue(); },
            set: function(v) { this.setValue(v); },
        },

        // Event when this observable gets updated
        __static__CHANGE: 'robo.Observable.CHANGE',

        // Set a property on another object that proxies into this provider
        installObservable: function(obj, key, enumerable)
        {
            // Drop proxy into obj
            Object.defineProperty(obj, key, {
                get: this.getValue.bind(this),
                set: this.setValue.bind(this),
                configurable: true,
                enumerable: enumerable !== undefined ? enumberable : true,
            });

            // ensure we can track this stuff to change sources etc
            if (!obj._observables)
                Object.defineProperty(obj, '_observables', {
                    configurable: true, enumerable: false, writable: false, value: {}
                });

            obj._observables[key] = this;
        },

        getValue: function()
        {
        },

        setValue: function(v)
        {
        },

        // Provide us with either a model & attribute to monitor or a static
        // thing, or an observable object
        setSource: function(source)
        {
            if (source && source.model && source.attribte)
                this.setModelAndAttribute(model, attribute);
            else
                this.setStatic(source);
        },

        // Simply a value, nothing special
        setStatic: function(s)
        {
            this.value = s;
            this.triggerChange();
        },

        // monitor a model/attr endpoint for this value
        setModelAndAttribute: function(model, attribute)
        {
        },

        // Needs to fire whenever the source updates or we change sources
        triggerChange: function()
        {
            Log.d('value changed to ' + this.value);
            this.trigger(this.constructor.CHANGE);
        }

    });

});
