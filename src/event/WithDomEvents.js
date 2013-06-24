define(function(require) {

    var compose = require('compose');

    compose.namespace('robo.event');

    // Handle binding stuff to actual DOM pieces. Expects there to be a
    // this.element object
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

        // use the DOM system for routing events
        __wrapped__trigger: function(fn, args)
        {
            var name = args[0];
            var event = document.createEvent('Event');
            event.initEvent(name, true, true);
            this.element.dispatchEvent(event);
        },

    });

});
