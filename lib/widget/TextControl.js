var typedef = require('typedef');
var Control = require('robo/widget/Control');

module.exports = typedef.class('TextControl').extends(Control).define({

    // Mess with the inner text
    __property__text:
    {
        get: function() { return this.element.innerText; },
        set: function(v) { this.element.innerText = v; }
    }

});
