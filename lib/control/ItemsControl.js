var Control        = require('./Control');
var ContentControl = require('./ContentControl');
var typedef        = require('typedef');
var _              = require('underscore');

module.exports = ItemsControl = typedef

.class('ItemsControl') .extends(Control) .define({

    __observable__contentProperty__items: null,

    // keep track of all the views, indexed by the location in the collection
    _views: null,

    // Setup the items and monitor add events
    __constructor__: function()
    {
        this.items = new Collection();
        this._views = [];
        this.on('set:items', this._setupItems);
        this._setupItems();
    },

    // Should be e.g. data templating
    __virtual__createItemView: function(item)
    {
        return new ContentControl().setContent(item);
    },

    // Draw and bind the entire list
    __override__fluent__render: function()
    {
    },

    // Start watching everything we need for the items
    _setupItems: function()
    {
        this.stopListening();

        this._clearItems();
        if (typedef.is(this.items, IList)) {
            console.log('_setupItems called with ' + this.items.count() + ' items');
            this.listenTo(this.items, 'add', this._addItem);
            this.listenTo(this.items, 'remove', this._removeItem);
            this.listenTo(this.items, 'clear', this._clearItems);

            var _this = this;
            this.items.each(function(item) {
                _this._addItem(item);
            });
        }

    },

    _clearItems: function()
    {
        this.element.innerHTML = '';
        this._views = [];
    },

    // Close out the view for this mess
    _removeItem: function(item)
    {
        var index = this.items.indexOf(item);
        var view = this._getItemView(item);
        view.close();
        this._views.splice(index, 1);
    },

    // Create a view, track the item, and add it to the DOM
    _addItem: function(item)
    {
        var view = this._getItemView(item);
        this.element.appendChild(view.element);
    },

    // Create or a return a cached view for a given item
    _getItemView: function(item)
    {
        var index = this.items.indexOf(item);

        // already created view
        if (this._views[index])
            return this._views[index];

        // Need to instantiate a new view and set it up with our item
        var view = this.createItemView(item);
        this._views[index] = view;

        return view;
    }

});
