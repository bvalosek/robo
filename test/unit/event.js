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
        strictEqual(_(o._events).size(), 0, 'using off(name, cb) removes event node when empty');

        // off with no args
        o = new EObject();
        o.on('eventName', f);
        o.off();
        deepEqual(o._events, {}, 'off() clears all');

    });

    test('Value of this when left unset', function() {

        var o;
        var event = 'event';

        // using on
        o = new EObject();
        o.on(event, function() {
            strictEqual(this, o, 'callback with on() is same as object');
        });
        o.trigger(event);

        // using listenTo
        o     = new EObject();
        var p = new EObject();
        p.listenTo(o, event, function() {
            strictEqual(this, p, 'set with listenTo is object that is listening');
        });
        o.trigger(event);

    });

});
