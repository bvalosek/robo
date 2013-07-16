var typedef   = require('typedef');
var UiElement = require('../view/UiElement');

module.exports = typedef.class('Control').extends(UiElement).define({

    __property__enabled:
    {
        get: function() { return !this.element.disabled; },
        set: function(v) { this.element.disabled = !v; }
    }

});
