var WithEvents       = require('../../lib/event/WithEvents');
var typedef          = require('typedef');
var _                = require('underscore');

// Basic object w/ events
var EObject = typedef
    .class('EObject')
    .uses(WithEvents)
    .define();

QUnit.module('Events');

test('Basic callback adding and removing with on/off', function() {

    var o;
    var f = function() {};

    // with on/off(name, cb)
    o = new EObject();
    o.on('EVENT_NAME', f);
    strictEqual(_(o.__events).size(), 1, 'using on(name, cb) adds to __events');
    o.off('EVENT_NAME', f);
    strictEqual(_(o.__events).size(), 0, 'using off(name, cb) removes event node when empty');

    // off with no args
    o = new EObject();
    o.on('EVENT_NAME', f);
    o.off();
    deepEqual(o.__events, {}, 'off() clears all');

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
    strictEqual(_(p.__listeningTo).size(), 1, 'listeningTo updated on listenTo');
    strictEqual(p.__listeningTo[lId], o, 'listeningTo node pointing correctly');
    strictEqual(o.__events[event].length, 1, 'event handler added to listenee');
    deepEqual(o.__events[event][0],
        {callback: f, context: p, ctx: p },
        'event handler hash correct');
    o.trigger(event);

    // removing listening with stopListening()
    p.stopListening(o);
    strictEqual(_(p.__listeningTo).size(), 0, 'listening to empty after stop');
    strictEqual(_(o.__events[event]).size(), 0, 'events hash empty after stop');


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
