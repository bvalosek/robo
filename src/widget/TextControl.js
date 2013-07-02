define(function(require) {

    var compose = require('compose');
    var Control = require('robo/widget/Control');

    return compose.class('TextControl').extends(Control).define({

        // Mess with the inner text
        __property__text:
        {
            get: function() { return this.element.innerText; },
            set: function(v) { this.element.innerText = v; }
        }

    });

});
