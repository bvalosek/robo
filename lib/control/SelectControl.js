var ContentControl = require('./ContentControl');
var ItemsControl   = require('./ItemsControl');

module.exports = SelectControl = require('typedef')

.class('SelectControl') .extends(ItemsControl) .define({

    __override__readonly__tagName: 'select',

    __override__createItemView: function(item)
    {
        return new ContentControl({tag: 'option' }).setContent(item);
    }

});
