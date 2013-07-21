var Control = require('./Control');
var Binding = require('../event/Binding');

module.exports = ContentControl = require('typedef')

// A control that represents a single arbitrary object, string, text, model,
// etc
.class('ContentControl') .extends(Control) .define({

    __virtual__observable__contentProperty__content: null,

    __fluent__setContent: function(c)
    {
        this.content = c;
        return this;
    },

    __constructor__: function()
    {
        this.onPropertyChange('content', this.render);
    },

    __fluent__override__render: function()
    {
        this.element.innerText = ''+this.content;
        return this;
    }

});
