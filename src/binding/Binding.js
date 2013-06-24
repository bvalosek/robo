define(function(require) {

    var compose    = require('compose');
    var WithEvents = require('robo/event/WithEvents');

    compose.namespace('robo.binding');

    // A class that is used to connect a binding Target (such as a UI element)
    // to a binding Source (an object that implements Observable with
    // properties)
    return compose.class('Binding').uses(WithEvents).define({

        __enum__: [
            'SOURCE_PROPERTY_CHANGED',
            'TARGET_PROPERTY_CHANGED'
        ],

        // Provide a reference to our source and the property we're looking for
        // to change
        source: null,
        property: null,

        // Also can set a static value
        value: null,

        setSource: function(source)
        {
            if (source && source.source)
                this._setObjAndProj(source.source, source.property);
            else
                this._setStatic(source);
        },

        _setStatic: function(value)
        {
            // stop listening to source if we have one

            if (this.value !== value)
                this.trigger(this.constructor.SOURCE_PROPERTY_CHANGED);

            this.value = value;
        },

        _setObjAndProj: function(obj, prop)
        {
            if (this.source)
                this.stopListening(source);

            this.source   = obj;
            this.property = prop;

            this.listenTo(source, event, this._onSourceChange);
            this.trigger(this.constructor.SOURCE_PROPERTY_CHANGED);
        },

    });

});
