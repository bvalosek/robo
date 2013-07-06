define(function(require) {

    var WithEvents = require('robo/event/WithEvents');
    var compose    = require('compose');
    var _          = require('underscore');

    // Basic object w/ events
    var EObject = compose
        .class('EObject')
        .uses(WithEvents)
        .define();

    module('Events - using Backbone\'s test');

    // The following tests are taking from Backbone JS's event tests, using
    // only the stuff releeant to Robo

    test("on and trigger", 2, function() {
        var obj = new EObject();
        obj.counter = 0;
        obj.on('event', function() { obj.counter += 1; });
        obj.trigger('event');
        equal(obj.counter,1,'counter should be incremented.');
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        equal(obj.counter, 5, 'counter should be incremented five times.');
    });

    test("listenTo yourself", 1, function(){
        var e = new EObject();
        e.listenTo(e, "foo", function(){ ok(true); });
        e.trigger("foo");
    });

    test("listenTo yourself cleans yourself up with stopListening", 1, function(){
        var e = new EObject();
        e.listenTo(e, "foo", function(){ ok(true); });
        e.trigger("foo");
        e.stopListening();
        e.trigger("foo");
    });

    test("on, then unbind all functions", 1, function() {
        var obj = new EObject();
        obj.counter = 0;
        var callback = function() { obj.counter += 1; };
        obj.on('event', callback);
        obj.trigger('event');
        obj.off('event');
        obj.trigger('event');
        equal(obj.counter, 1, 'counter should have only been incremented once.');
    });

    test("bind two callbacks, unbind only one", 2, function() {
        var obj = new EObject();
        obj.counterA = 0; obj.counterB = 0;
        var callback = function() { obj.counterA += 1; };
        obj.on('event', callback);
        obj.on('event', function() { obj.counterB += 1; });
        obj.trigger('event');
        obj.off('event', callback);
        obj.trigger('event');
        equal(obj.counterA, 1, 'counterA should have only been incremented once.');
        equal(obj.counterB, 2, 'counterB should have been incremented twice.');
    });

    test("unbind a callback in the midst of it firing", 1, function() {
        var obj = new EObject();
        obj.counter = 0;
        var callback = function() {
            obj.counter += 1;
            obj.off('event', callback);
        };
        obj.on('event', callback);
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        equal(obj.counter, 1, 'the callback should have been unbound.');
    });

    test("two binds that unbind themeselves", 2, function() {
        var obj = new EObject();
        obj.counterA = 0; obj.counterB = 0;
        var incrA = function(){ obj.counterA += 1; obj.off('event', incrA); };
        var incrB = function(){ obj.counterB += 1; obj.off('event', incrB); };
        obj.on('event', incrA);
        obj.on('event', incrB);
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        equal(obj.counterA, 1, 'counterA should have only been incremented once.');
        equal(obj.counterB, 1, 'counterB should have only been incremented once.');
    });

    test("bind a callback with a supplied context", 1, function () {
        var TestClass = function () {
            return this;
        };
        TestClass.prototype.assertTrue = function () {
            ok(true, '`this` was bound to the callback');
        };

        var obj = new EObject();
        obj.on('event', function () { this.assertTrue(); }, (new TestClass()));
        obj.trigger('event');
    });

});
