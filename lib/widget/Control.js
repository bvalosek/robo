var View    = require('../view/View');

module.exports = require('typedef')

// A control the user can interact with
.class('Control').extends(View).define({

    __property__enabled:
    {
        get: function()
        {
            return !this.element.disabled;
        },

        set: function(v)
        {
            if (v != this.element.disabled) return;

            this.element.disabled = !v;
            this.triggerPropertyChanged('enabled');
        }
    }

});
