define(function(require) {

    var compose = require('compose');

    return compose.interface('ClickListener').define({
        __virtual__event__click: function(event) {}
    });

});
