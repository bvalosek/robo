define(function(require) {

    var WithEvents = require('robo/event/WithEvents');
    var compose    = require('compose');
    var _          = require('underscore');

    // Basic object w/ events
    var EObject = compose
        .class('EObject')
        .uses(WithEvents)
        .define();

    module('Events');

    test('Basic callback adding and removing with on/off', function() {

        var o;
        var f = function() {};

        // with on/off(name, cb)
        o = new EObject();
        o.on('eventName', f);
        strictEqual(_(o._events).size(), 1, 'using on(name, cb) adds to _events');
        o.off('eventName', f);
        strictEqual(_(o._events).size(), 0, 'using off(name, cb) removes event');
        console.log(o._events.eventName);

        // off with no args
        o = new EObject();
        o.on('eventName', f);
        o.off();
        deepEqual(o._events, {}, 'off() clears all');


    });

});
