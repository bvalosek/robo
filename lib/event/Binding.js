var WithEvents               = require('./WithEvents');
var WithObservableProperties = require('./WithObservableProperties');
var typedef                  = require('typedef');
var _                        = require('underscore');

module.exports = Binding = typedef

// A class that is used to connect a binding Target (such as a UI element) to a
// binding Source (an object that implements WithObservableProperties)
.class('Binding') .uses(WithEvents) .define({

    __events__: [

        // fired by the target when we want to know that it's value should be
        // propigated to our binding
        'targetChanged',

        // Fired by our binding when the source we're listening to (or what
        // we're sourcing) has changed
        'sourceChanged'
    ],

    // Provide a reference to our source and the property we're looking for
    // to change. Source must be an ObservableObject
    source   : null,
    property : null,

    // Also can set a static value
    valueWhenNull: null,

    // Bind to a target property. Multiple targets could be bound potentially.
    // If the target is an ObservableObject, assume we can listen for change
    // events
    __fluent__setTarget: function(target, prop)
    {
        var _this = this;

        target[prop] = this.value;

        this.on(Binding.events.sourceChanged, function() {
            this[prop] = _this.value;
        }, target);

        if (typedef.is(target, WithObservableProperties)) {
            this.listenTo(target, 'change:'  + prop, function(v) {
                _this.value = target[prop];
            });
        }

        return this;
    },

    // Return the binding to a state of having no bound targets. We need to
    // clear all of our sourceChanged broadcasts and ensure we're only
    // listening to the source
    __fluent__clearTargets: function()
    {
        this.off(Binding.events.sourceChanged);
    },

    // Either set the static or our corresponding source object/property
    __property__value:
    {
        get: function()
        {
            if (this.source && this.property)
                return this.resolveSource()[this.resolveProperty()];
            else
                return this.valueWhenNull;
        },

        set: function(value)
        {
            if (this.source && this.property) {
                this.resolveSource()[this.resolveProperty()] = value;
            } else if (value !== this.valueWhenNull) {
                this.valueWhenNull = value;
                this.trigger(Binding.events.sourceChanged);
            }
        }
    },

    // Bolt into an observable source
    __fluent__setSource: function(source, prop)
    {
        if (source === this.source && prop == this.property)
            return;

        if (this.source)
            this.stopListening(this.source);

        if (arguments.length == 2 &&
            typedef.is(source, WithObservableProperties)) {

            this.source   = source;
            this.property = prop;

            prop = this.resolveProperty() === prop ? prop : null;

            var _this = this;
            this.listenTo(source, prop ? 'change:' + prop : 'change', function() {
                _this.trigger(Binding.events.sourceChanged);
            });

        } else {
            this.source   = null;
            this.property = null;

            if (this.valueWhenNull === source) return;
            this.valueWhenNull = source;
        }

        this.trigger(Binding.events.sourceChanged);

        return this;
    },

    // Proper source and prop from dot notation
    _resolve: function()
    {
        var source   = this.source;
        var property = this.property;

        if (property) {
            var parts    = this.property.split('.');
            property = parts[0];

            for (var i = 0; i < parts.length - 1; i++) {
                source = source[property];
                property = parts[i+1];
            }
        }

        return {
            source: source,
            property: property
        };
    },

    resolveSource: function()
    {
        return this._resolve().source;
    },

    resolveProperty: function()
    {
        return this._resolve().property;
    }

});
