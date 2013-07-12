var typedef      = require('typedef');
var ValueControl = require('./ValueControl');
var Binding      = require('../event/Binding');

module.exports = typedef.class('TextInput').extends(ValueControl).define({

    __override__readonly__tagName: 'input',

    __event__keyup: function()
    {
        this.trigger(Binding.events.targetChanged);
    }

});
