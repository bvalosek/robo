define(function(require) {

    var compose = require('compose');

    // Modify an object that already has mixed in WithEvents that will route
    // all events onto the DOM
    return compose.mixin('WithDomEvents').define({

        // Make sure to attach to the DOM node as well
        __after__on: function(name, callback)
        {
            if (!this.element) return;
            this.element.addEventListener(name, callback);
        },

        // Make sure to attach to the DOM node as well
        __after__off: function(name, callback)
        {
            if (!this.element) return;
            this.element.removeEventListener(name, callback);
        },

        // Trigger on the DOM node instead of on our actual event bus
        __wrapped__trigger: function(fn, args)
        {
            var name = args[0];
            var event = document.createEvent('Event');
            event.initEvent(name, true, true);
            this.element.dispatchEvent(event);
        },

    });

});
