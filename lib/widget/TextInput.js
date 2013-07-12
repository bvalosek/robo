var typedef      = require('typedef');
var ValueControl = require('robo/widget/ValueControl');
var Binding      = require('robo/event/Binding');

module.exports = typedef.class('TextInput').extends(ValueControl).define({

    __override__readonly__tagName: 'input',

    __event__keyup: function()
    {
        this.trigger(Binding.events.targetChanged);
    }

});
