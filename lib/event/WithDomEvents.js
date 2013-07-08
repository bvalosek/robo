var compose = require('compose');

// Modify an object that already has mixed in WithEvents that will route
// all events onto the DOM
var WithDomEvents = compose.mixin('WithDomEvents').define({

    // Make sure to attach to the DOM node as well
    __after__on: function(name, callback, context)
    {
        if (!this.element) return;
        this.element.addEventListener(name, function(domEvent) {
            if (domEvent.actualEvent)
                callback.call(context, domEvent.actualEvent, domEvent.roboParameter);
            else
                callback.call(context, domEvent.roboParameter);
        });
    },

    // Make sure to attach to the DOM node as well
    __after__off: function(name, callback, context)
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
        event.roboParameter = args[1];
        this.element.dispatchEvent(event);

        var all = document.createEvent('Event');
        all.initEvent('all', true, true);
        all.roboParameter = args[1];
        all.actualEvent = name;
        this.element.dispatchEvent(all);
    }

});

module.exports = WithDomEvents;
