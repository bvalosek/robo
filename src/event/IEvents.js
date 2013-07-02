define(function(require) {

    var compose = require('compose');

    // Bare minimum required to ensure that we can listen to this (e.g.
    // something.listenTo(blah))
    return compose.interface('IEvents').define({

        on      : function(event, action, context) {},
        off     : function(event, action, context) {},
        once    : function(event, action, context) {},
        trigger : function(event) {}

    });

});
