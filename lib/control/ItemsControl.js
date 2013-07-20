var Control        = require('./Control');
var ContentControl = require('./ContentControl');

module.exports = ItemsControl = require('typedef')

.class('ItemsControl') .extends(Control) .define({

    __observable__contentProperty__items: null,

    // Setup the items and monitor add events
    __constructor__: function()
    {
        this.listenTo(this, 'change:items', function(x) { console.log(x); });
        this.items = new Collection();
        this.listenTo(this.items, 'add', this._addItem);
    },

    _addItem: function(item)
    {
        this.element.appendChild(this.createItemView(item).element);
    },

    // Cache the item views, we only need to create them once.
    __virtual__createItemView: function(item)
    {
        return new ContentControl().setContent(item);
    }

});
