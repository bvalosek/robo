var typedef          = require('typedef');
var WithEvents       = require('./WithEvents');
var ObservableObject = require('./ObservableObject');
var _                = require('underscore');

module.exports = Binding = typedef

// A class that is used to connect a binding Target (such as a UI element)
// to a binding Source (an object that implements Observable with
// properties)
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

    // track all of our targets
    targets: [],

    // Also can set a static value
    valueWhenNull: null,

    // Bind to a target property. Multiple targets could be bound
    __fluent__setTarget: function(target, prop)
    {
        var _this = this;

        // Target always gets overriden when getting set
        target[prop] = this.value;

        // When we fire a sourceChange event, update the target
        this.on(Binding.events.sourceChanged, function() {
            this[prop] = _this.value;
        }, target);

        // If the target is ObservableObject, then make sure to update our
        // value when it changes as well
        if (typedef.is(target, ObservableObject)) {
            this.listenTo(target, 'change:'  + prop, function(v) {
                _this.value = target[prop];
            });
        }

        return this;
    },


    // Return the binding to a state of having no bound targets. We need to
    // clear all of our sourceChanged broadcasts and ensure we're only
    // listening to the source
    //
    // DANGEROUS: relies on underlying implementation of events
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
                return this.source[this.property];
            else
                return this.valueWhenNull;
        },

        set: function(value)
        {
            if (this.source && this.property) {
                this.source[this.property] = value;
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

        // Ensure that we stop listening to existing source
        if (this.source)
            this.stopListening(this.source);

        // Our source can either be an observable object and a property, or
        // simple a "static" value that just sits there
        if (arguments.length == 2 && typedef.is(source, ObservableObject)) {
            this.source   = source;
            this.property = prop;

            // proxy the property chanage event from the source to our binding
            var _this = this;
            this.listenTo(source, 'change:' + prop, function() {
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
    }

});
