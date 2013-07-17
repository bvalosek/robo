var Control = require('./Control');
var Binding = require('../event/Binding');

module.exports = ContentControl = require('typedef')

// A control that represents a single arbitrary object, string, text, model,
// etc
.class('ContentControl') .extends(Control) .define({

    __constructor__: function()
    {
        this.contentView = null;
        this.on('change:content', this._redraw);
    },

    _redraw: function()
    {
        // Get the element that we're going to draw
        var view = this.template(this.content);

        if (view === this.contentView)
            return;

        this.contentView = view;

        this.element.innerHTML = '';
        this.element.appendChild(this.contentView.element);

    },

    template: function(content)
    {
        var span = new View({ tag: 'span' })
            .addBinding('text', 'fullName')
            .setDataContext(content);

        return span;
    },

    __observable__contentProperty__content: null

});
