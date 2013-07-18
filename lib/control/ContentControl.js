var Control = require('./Control');
var Binding = require('../event/Binding');

module.exports = ContentControl = require('typedef')

// A control that represents a single arbitrary object, string, text, model,
// etc
.class('ContentControl') .extends(Control) .define({

    __observable__contentProperty__content: null,

    __constructor__: function()
    {
        this.contentView = null;
        this.on('change:content', this._redraw);
    },

    _redraw: function()
    {
        this.text = this.content;
    }

});
