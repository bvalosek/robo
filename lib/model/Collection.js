var WithObservableProperties = require('../event/WithObservableProperties');
var IList                    = require('./IList');
var _                        = require('underscore');
var typedef                  = require('typedef');

module.exports = Collection = typedef

// An arbitrary, evented, observable collection of (preferably) observable
// objects
.class('Collection') .uses(WithObservableProperties) .implements(IList) .define({

    _items: null,

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
        this.trigger('add', obj);
        this.triggerPropertyChanged('length');

        if (typedef.is(obj, WithObservableProperties))
            this.listenTo(obj, 'change',
                function() { this.trigger('change', obj); });
    },

    get: function(index)
    {
        return this._items[index];
    },

    indexOf: function(value)
    {
        return this._items.indexOf(value);
    },

    count: function()
    {
        return this._items.length;
    },

    each: function(fn)
    {
        this._items.forEach(fn);
    },

    __fluent__clear: function()
    {
        this.stopListening();
        this._items = [];
        this.triggerPropertyChanged('length');
        this.trigger('clear');
    },

    __fluent__removeAt: function(index)
    {
        var obj = this._items[index];
        this.trigger('remove', obj);
        this._items.splice(index, 1);
        this.triggerPropertyChanged('length');
        this.stopListening(obj);
        return this;
    },

    __fluent__remove: function(obj)
    {
        return this.removeAt(this._items.indexOf(obj));
    }

});
