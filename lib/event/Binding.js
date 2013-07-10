var typedef    = require('typedef');
var WithEvents = require('../event/WithEvents');

// A class that is used to connect a binding Target (such as a UI element)
// to a binding Source (an object that implements Observable with
// properties)
var Binding = typedef.class('Binding').uses(WithEvents).define({

    __static__readonly__SOURCE_PROPERTY_CHANGED : 'Binding.SOURCE_PROPERTY_CHANGED',
    __static__readonly__TARGET_PROPERTY_CHANGED : 'Binding.TARGET_PROPERTY_CHANGED',

    // Provide a reference to our source and the property we're looking for
    // to change. Source must be an ObservableObject
    source   : null,
    property : null,

    // Also can set a static value
    valueWhenNull: null,

    // Bind to a target property. Multiple targets could be bound
    __fluent__setTarget: function(target, prop)
    {
        var _this = this;
        target[prop] = this.value;

        // Using binding to edit the target's value
        this.on(Binding.SOURCE_PROPERTY_CHANGED, function() {
            this[prop] = _this.value;
        }, target);

        // is target bindable?
        if (typedef.is(target, WithEvents)) {
            this.listenTo(target, Binding.TARGET_PROPERTY_CHANGED, function(v) {
                _this.value = target[prop];
            });
        }

        return this;
    },

    // Remove a target. IS LESS GRANULAR THAN setTarget in that it will
    // remove anything with the target object completely, semi djankx
    __fluent__removeTarget: function(target)
    {
        this.off(null, null, target);

        if (typedef.is(target, WithEvents))
            this.stopListening(target, Binding.TARGET_PROPERTY_CHANGED);
    },

    // Either set the static or our corresponding source object/property
    __property__value: {
        get: function() {
            if (this.source && this.property)
                return this.source[this.property];
            else
                return this.valueWhenNull;
        },
        set: function(value) {
            if (this.source && this.property)
                this.source[this.property] = value;
            else
                this._setStatic(value);
        }
    },

    // Remove all listening + clear out source
    __fluent__reset: function()
    {
        this.stopListening();
        this.source   = null;
        this.property = null;
    },

    // Bolt into an observable source
    __fluent__setSource: function(source, prop)
    {
        if (arguments.length == 2)
            this._setObjectAndProperty(source, prop);
        else
            this._setStatic(source);

        return this;
    },

    _setStatic: function(value)
    {
        if (this.source) {
            this.stopListening(this.source);
            this.source = null;
            this.property = null;
        }

        if (this.valueWhenNull !== value)
            this._onSourceChange();

        this.valueWhenNull = value;
    },

    _setObjectAndProperty: function(obj, prop)
    {
        if (this.source)
            this.stopListening(this.source);

        this.source   = obj;
        this.property = prop;

        // one way binding source -> target
        var event = 'change' + (prop ? ':' + prop : '');
        this.listenTo(this.source, event, this._onSourceChange);

        this._onSourceChange();
    },

    _onSourceChange: function()
    {
        this.trigger(Binding.SOURCE_PROPERTY_CHANGED);
    }

});

module.exports = Binding;
