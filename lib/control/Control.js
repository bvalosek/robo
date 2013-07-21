var View    = require('../view/View');

module.exports = require('typedef')

// A control the user can interact with
.class('Control') .extends(View) .define({

    __observable__enabled: true,

    __constructor__: function()
    {
        this.onPropertyChange('enabled', function() {
            this.element.disabled = !this.enabled;
        });
    }

});
