var UiElement = require('./UiElement');
var _         = require('underscore');

module.exports = Layout = require('typedef')

// Yah bro
.class('Layout') .extends(UiElement) .define({

    __constructor__: function()
    {
        this.bindings = [];
    },

    __fluent__setDataContext: function(ds)
    {
        this.dataContext = ds;
        _(this.bindings).each(function(b) {
            b.setSource(ds, b.prop);
        });
        return this;
    }

});
