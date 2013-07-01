define(function(require) {
    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    // A class that is used to connect a binding Target (such as a UI element)
    // to a binding Source (an object that implements Observable with
    // properties)
    return compose.class('Binding').uses(WithEvents).define({

        __enum__: [
            'SOURCE_PROPERTY_CHANGED',
            'TARGET_PROPERTY_CHANGED',
            'ONE_WAY',
            'TWO_WAY',
            'ONE_WAY_TO_SOURCE',
            'ONCE'
        ],

        // Provide a reference to our source and the property we're looking for
        // to change
        source: null,
        property: null,

        // Also can set a static value
        valueWhenNull: null,

        // Something that implements IValueConverter to change between source and target
        valueConverter: null,

        // The mode
        mode: 'ONE_WAY',

        // The ability to acutally set the binding of a target
        __static__setBinding: function(target, prop, binding)
        {
            // One-way binding
            target.listenTo(binding,
                'robo.binding.Binding.SOURCE_PROPERTY_CHANGED',
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
            this.trigger(this.constructor.SOURCE_PROPERTY_CHANGED);
        }

    });

});
