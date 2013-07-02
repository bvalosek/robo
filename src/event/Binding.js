define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    // A class that is used to connect a binding Target (such as a UI element)
    // to a binding Source (an object that implements Observable with
    // properties)
    var Binding = compose.class('Binding').uses(WithEvents).define({

        __static__readonly__ONE_ONE                 : 1001,
        __static__readonly__SOURCE_PROPERTY_CHANGED : 1002,

        // Provide a reference to our source and the property we're looking for
        // to change. Source must be an ObservableObject
        source   : null,
        property : null,

        // Also can set a static value
        valueWhenNull: null,

        // The ability to acutally set the binding of a target
        __static__setBinding: function(target, prop, binding)
        {
            // One-way binding
            target.listenTo(binding,
                Binding.SOURCE_PROPERTY_CHANGED,
                function() {
                    this[prop] = binding.value;
                });
        },

        // Either set the static or our corresponding source object/property
        __property__value: {
            get: function() {
                if (this.source && this.property)
                    return this.source.get(this.property);
                else
                    return this.valueWhenNull;
            },
            set: function(value) {
                if (this.source && this.property)
                    this.source.set(this.property, value);
                else
                    this._setStatic(value);
            }
        },

        // smart set source
        setSource: function(source, prop)
        {
            if (arguments.length == 2)
                this._setObjectAndProperty(source, prop);
            else
                this._setStatic(source);
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

    return Binding;

});
