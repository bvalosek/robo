var typedef = require('typedef');
var View    = require('../view/View');

module.exports = typedef.class('Control').extends(View).define({

    __property__enabled:
    {
        get: function() { return !this.element.disabled; },
        set: function(v) { this.element.disabled = !v; }
    }

});
