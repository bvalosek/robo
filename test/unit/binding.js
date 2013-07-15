var typedef          = require('typedef');
var Binding          = require('../../lib/event/Binding');
var WithEvents       = require('../../lib/event/WithEvents');
var ObservableObject = require('../../lib/event/ObservableObject');
var WithBindings     = require('../../lib/event/WithBindings');
var _                = require('underscore');

// Basic object w/ events
var EObject = typedef
    .class('EObject')
    .uses(WithEvents)
    .define();

QUnit.module('Binding');

test('Setting source to static', 4, function() {
    var b = new Binding();
    b.on(Binding.events.sourceChanged, function() { ok(true); });
    b.setSource(123);
    strictEqual(b.value, 123, 'static value');
    b.setSource(456);
    strictEqual(b.value, 456, 'static value');
    b.setSource(456);
});

test('Setting value directly', 4, function() {
    var b = new Binding();
    b.on(Binding.events.sourceChanged, function() { ok(true); });
    b.value = 123;
    strictEqual(b.value, 123, 'static value');
    b.value = 456;
    strictEqual(b.value, 456, 'static value');
});

test('Setting an ObservableObject as source', function() {

    var b = new Binding();
    var o = new (typedef.class('O').extends(ObservableObject).define({
        __observable__prop: undefined
    }))();

    b.on(Binding.events.sourceChanged, function() { ok(true); });
    b.setSource(o, 'prop');
    o.prop = 123;
    o.prop = 123; // nop
    o.prop = null;
    b.setSource(1234);
    o.prop = 444; // nop

});

test('Setting target', function() {
    var O = typedef.class('O').extends(ObservableObject).define({
        __observable__prop: undefined
    });

    var o = new O();
    var p = {foo:  123};
    var b = new Binding().setSource(o, 'prop').setTarget(p, 'foo');

    strictEqual(p.foo, undefined, 'init value');
    o.prop = 555;
    strictEqual(p.foo, 555, 'changed via source');
    b.value = 666;
    strictEqual(p.foo, 666, 'changed via binding value');

    var x = new O();
    var y = new O();
    x.prop = 10;
    y.prop = 20;
    var binding = new Binding().setSource(x, 'prop').setTarget(y, 'prop');

    strictEqual(y.prop, 10, 'target set up');
    x.prop = 15;
    strictEqual(y.prop, 15, 'target changed');
    y.prop = 30;

});

test('WithBindings tracking', function() {

    var Tracker = typedef.class()
        .extends(ObservableObject).uses(WithBindings).define();

    var a  = new Tracker({ ax: 123, ay: 456 });
    var b  = new ObservableObject({ ax: 999, ay: 999 });
    var t  = {x: undefined, y: undefined};
    var t2 = {x: undefined, y: undefined};

    a.addBinding('ax', t, 'x');
    strictEqual(_(a._bindings).size(), 1, 'single entry');
    a.ax = 555;
    strictEqual(t.x, 555, 'bind created');
    a.addBinding('ax', t2, 'x');
    strictEqual(_(a._bindings).size(), 1, 're-use binding for same prop');
    strictEqual(t2.x, 555, 'new binding init fired');
    a.ax = 987;
    strictEqual(t.x, 987, 'change');
    strictEqual(t2.x, 987, 'change');
    a.addBinding('ay', t, 'y');
    strictEqual(_(a._bindings).size(), 2, 'new binding');
    a.unbindAll();
    a.ax = 777; a.ay = 777;
    equal(t.x != 777, true, 'no change');
    equal(t.y != 777, true, 'no change');

});

test('Unbind and rebind', function() {

    var Tracker = typedef.class()
        .extends(ObservableObject).uses(WithBindings).define();

    var a = new Tracker({ x: 123, y: 456 });
    var t = { x: undefined, y: undefined };

    a.addBinding('x', t, 'x');
    strictEqual(t.x, 123, 'init');
    a.unbindAll();
    a.x = 111;
    strictEqual(t.x, 123, 'no bind');

    // redo
    a.addBinding('x', t, 'x');
    strictEqual(t.x, 111, 'init rebind');
    a.x = 222;
    strictEqual(t.x, 222, 'trigger rebind');

});

test('Unbiding with two way', function() {

    var Tracker = typedef.class()
        .extends(ObservableObject).uses(WithBindings).define();

    var a = new Tracker({ x: 123, y: 567 });
    var b = new ObservableObject({ x: undefined, y: undefined });

    a.addBinding('x', b, 'x');
    strictEqual(b.x, 123, 'b bound');
    b.x = 111;
    strictEqual(a.x, 111, 'a bound');

    a.unbindAll();
    a.x = 777;
    strictEqual(b.x, 111, 'oneway unbound');
    b.x = 999;
    strictEqual(a.x, 777, 'twoway unbound');

});

test('Data context change', function() {

    var Tracker = typedef.class()
        .extends(ObservableObject).uses(WithBindings).define();

    var ds = new ObservableObject({ x: 456 });
    var vm = new Tracker({x: undefined });
    var t = {x: 555 };

    vm.addBinding('x', t, 'x');
    strictEqual(t.x, undefined, 'init');
    vm.setDataContext(ds);
    strictEqual(t.x, 456, 'init');

});
