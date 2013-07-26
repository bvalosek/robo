var IDictionary              = require('./IDictionary');
var WithObservableProperties = require('../event/WithObservableProperties');
var _                        = require('underscore');

module.exports = Dictionary = require('typedef')

// Hash container that implements the IDictionary interface
.class('Dictionary') .implements(IDictionary) .uses(WithObservableProperties) .define({

    _hash: null,

    __constructor__: function(_hash)
    {
       this._hash = {} || _hash;
    },

    // Insert key value pair
    __fluent__add: function(key, value)
    {
        // defer to set if already there
        if (this.containsKey(key)) {
            this.set(key, value);
            return this;
        }

        // nop
        var oldVal = this._hash[key];
        if (value === oldVal)
            return;

        this._hash[key] = value;

        // propigate change
        if (typedef.is(value, WithObservableProperties)) {
            this.listenTo(value, 'change', function() {
                this.triggerPropertyChanged(key);
            });
        }

        this.triggerPropertyChanged(key);
        return this;
    },

    // Remove element under key
    __fluent__remove: function(key)
    {
        if (!this.containsKey(key))
            return this;

        delete this._hash[key];

        this.trigger('change');
        return this;
    },

    // Reset
    __fluent__clear: function()
    {
        this.stopListening();
        this._hash = {};
        this.triggerPropertyChanged('length');
        this.trigger('clear');

        this.trigger('change');
        return this;
    },


    __fluent__set: function(key, value)
    {
        this._hash[key] = value;
        return this;
    },

    // Get a value of a certain key
    get: function(key)
    {
        return this._hash[key];
    },

    containsKey: function(key)
    {
        return this._hash.hasOwnProperty(key);
    },

    // Size of stuff
    count: function()
    {
        return _(this._hash).size();
    }

});
