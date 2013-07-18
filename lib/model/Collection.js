var WithObservableProperties = require('../event/WithObservableProperties');
var _                        = require('underscore');

module.exports = Collection = require('typedef')

// An arbitrary, evented, observable collection of (preferably) observable
// objects
.class('Collection') .uses(WithObservableProperties) .define({

    __constructor__: function(_items)
    {
        this._items = _(_items).toArray() || [];
    },

    __property__length:
    {
        get: function() { return this._items.length; }
    },

    // Add new item to the collection. Will push it onto the stack, listen for
    // changes to rebroadcast, and fire off change events
    __fluent__add: function(obj)
    {
        this._items.push(obj);

        this.listenTo(obj, 'change',
            function() { this.trigger('change', obj); });

        this.trigger('add', obj);
        this.triggerPropertyChanged('length');
    },

    each: function(fn)
    {
        this._items.forEach(fn);
    },

    __fluent__remove: function(obj)
    {
        var index = this._items.indexOf(obj);
        if (index === -1)
            return;

        this._items.splice(index, 1);

        this.stopListening(obj);

        this.trigger('remove', obj);
        this.triggerPropertyChanged('length');

        return this;
    }

});
