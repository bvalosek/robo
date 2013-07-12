var typedef     = require('typedef');
var TextControl = require('robo/widget/TextControl');
var Binding     = require('robo/event/Binding');

module.exports = typedef.class('CheckBox').extends(TextControl).define({

    __override__readonly__tagName: 'input',

    __event__click: function()
    {
        this.trigger(Binding.events.targetChanged);
    },

    __property__checked:
    {
        get: function() { return this.element.checked; },
        set: function(v) { this.element.checked = v; }
    }

});
