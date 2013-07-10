var typedef = require('typedef');
var Control = require('robo/widget/Control');

module.exports = typedef.class('ValueControl').extends(Control).define({

    // Mess with the inner text
    __property__value:
    {
        get: function() { return this.element.value; },
        set: function(v) { this.element.value = v; }
    }

});
