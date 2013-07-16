var WithEvents = require('../event/WithEvents');
var _          = require('underscore');

module.exports = Collection = require('typedef')

// An arbitrary, evented, observable collection of (preferably) observable
// objects
.class('Collection') .uses(WithEvents) .define({

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

        // Tell the object when it broadcast a change message to fire one off
        // for the collection
        this.listenTo(obj, 'change',
            function() { this.trigger('change', obj); });

        this.trigger('add', obj);
        this.trigger('change');
        this.trigger('change:length');
    },

    __fluent__remove: function(obj)
    {
        var index = this._items.indexOf(obj);
        if (index === -1)
            return;

        this._items.splice(index, 1);

        // ensure this object is broadcasting to us
        this.stopListening(obj);

        this.trigger('remove', obj);
        this.trigger('change');
        this.trigger('change:length');

        return this;
    }

});
