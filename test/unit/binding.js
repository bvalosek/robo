var typedef          = require('typedef');
var Binding          = require('../../lib/event/Binding');
var WithEvents       = require('../../lib/event/WithEvents');
var ObservableObject = require('../../lib/event/ObservableObject');
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

test('Changing source', 5, function() {

    var a = new ObservableObject({ prop: 123 });
    var b = new ObservableObject({ prop: 456 });
    var t = { prop: undefined };

    var binding = new Binding().setSource(a, 'prop').setTarget(t, 'prop');
    strictEqual(t.prop, 123, 'init');
    binding.on(Binding.events.sourceChanged, function() { ok(true, 'source change'); });
    binding.setSource(b, 'prop');
    strictEqual(t.prop, 456, 'update ons ource change');
    a.prop = 'nope'; // nop
    binding.setSource('static'); // trigers a change event
    strictEqual(t.prop, 'static', 'setting static updates');

    a.prop = 999; b.prop = 999; // nops
});

