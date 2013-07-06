define(function(require) {

    var WithEvents       = require('robo/event/WithEvents');
    var WithEventLogging = require('robo/event/WithEventLogging');
    var compose          = require('compose');
    var _                = require('underscore');

    // Basic object w/ events
    var EObject = compose
        .class('EObject')
        .uses(WithEvents, WithEventLogging)
        .define();

    module('Events');

    test('Basic callback adding and removing with on/off', function() {

        var o;
        var f = function() {};

        // with on/off(name, cb)
        o = new EObject();
        o.on('EVENT_NAME', f);
        strictEqual(_(o._events).size(), 1, 'using on(name, cb) adds to _events');
        o.off('EVENT_NAME', f);
        strictEqual(_(o._events).size(), 0, 'using off(name, cb) removes event node when empty');

        // off with no args
        o = new EObject();
        o.on('EVENT_NAME', f);
        o.off();
        deepEqual(o._events, {}, 'off() clears all');

    });

    test('Basic callback adding/removing with listenTo and stopListening', function() {

        var event = 'EVENT_NAME';
        var f     = function() { strictEqual(this, p, 'listenTo cb in correct context'); };
        var o, p;

        // setup listener hash
        o = new EObject();
        p = new EObject();
        p.listenTo(o, event, f);
        var lId = o._listenerId;
        strictEqual(_(p._listeningTo).size(), 1, 'listeningTo updated on listenTo');
        strictEqual(p._listeningTo[lId], o, 'listeningTo node pointing correctly');
        strictEqual(o._events[event].length, 1, 'event handler added to listenee');
        deepEqual(o._events[event][0],
            {callback: f, context: p, ctx: p },
            'event handler hash correct');
        o.trigger(event);

        // removing listening with stopListening()
        p.stopListening(o);
        strictEqual(_(p._listeningTo).size(), 0, 'listening to empty after stop');
        strictEqual(_(o._events[event]).size(), 0, 'events hash empty after stop');


    });

    test('Value of this when left unset', function() {

        var o;
        var event = 'EVENT_NAME';

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
