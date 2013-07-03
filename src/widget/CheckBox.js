define(function(require) {

    var compose     = require('compose');
    var TextControl = require('robo/widget/TextControl');
    var Binding     = require('robo/event/Binding');

    return compose.class('CheckBox').extends(TextControl).define({

        __override__tagName: 'input',

        __event__click: function()
        {
            this.trigger(Binding.TARGET_PROPERTY_CHANGED);
        },

        __property__checked:
        {
            get: function() { return this.element.checked; },
            set: function(v) { this.element.checked = v; }
        }

    });

});
