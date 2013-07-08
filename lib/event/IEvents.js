define(function(require) {

    var compose = require('compose');

    // All events in Robo must use this interface to handle binding etc. This
    // is the core system by which all evented interactions in Robo function.
    return compose.interface('IEvents').define({

        // Bind a callback function to an event, such that when that event is
        // triggered, the callback is fired. Bind to an optional
        // context(defaults to this object). This is used when we know that
        // *something else* will trigger an event on this object, and we want
        // to react to it
        __fluent__on : function(eventName, callback, _context) {},

        // Remove the event callbacks from this object. Will attempt to match
        // against the context, callback and event name if provided. The fewer
        // parameters provided, the more general the removal. Calling with no
        // paramters removes all event callbacks
        __fluent__off : function(_eventName, _callback, _context) {},

        // Inversion-of-control version of 'on'. Let's this object keep track
        // of the objects it is listening to so that it is easier to clear out
        // the event callbacks on the other object. This is used when we know
        // another object is going to fire off an event, and we want to react
        // to it.
        __fluent__listenTo : function(otherObject, eventName, callback) {},

        // Corresponding to 'listenTo', clear out the event callbacks on other
        // objects to which this one is lisstening to. Like 'off', providing
        // more parameters will clear out more and more events.
        __fluent__stopListening : function(_otherObject, _eventName, _callback) {},

        // Fire off an event to all attached event callbacks on this object
        __fluent__trigger: function(eventName, _eventParameters) {}

    });

});
