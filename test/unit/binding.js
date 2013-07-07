define(function(require) {

    var compose          = require('compose');
    var Binding          = require('robo/event/Binding');
    var WithEvents       = require('robo/event/WithEvents');
    var ObservableObject = require('robo/event/ObservableObject');

    // Basic object w/ events
    var EObject = compose
        .class('EObject')
        .uses(WithEvents)
        .define();

    module('Binding');

    test('Setting source to static', 4, function() {
        var b = new Binding();
        b.on(Binding.SOURCE_PROPERTY_CHANGED, function() { ok(true); });
        b.setSource(123);
        strictEqual(b.value, 123, 'static value');
        b.setSource(456);
        strictEqual(b.value, 456, 'static value');
        b.setSource(456);
    });

    test('Setting value directly', 4, function() {
        var b = new Binding();
        b.on(Binding.SOURCE_PROPERTY_CHANGED, function() { ok(true); });
        b.value = 123;
        strictEqual(b.value, 123, 'static value');
        b.value = 456;
        strictEqual(b.value, 456, 'static value');
    });

    test('Setting an ObservableObject as source', function() {

        var b = new Binding();
        var o = new (compose.class('O').extends(ObservableObject).define({
            __observable__prop: undefined
        }))();

        b.on(Binding.SOURCE_PROPERTY_CHANGED, function() { ok(true); });
        b.setSource(o, 'prop');
        o.prop = 123;
        o.prop = 123; // nop
        o.prop = null;
        b.setSource(1234);
        o.prop = 444; // nop

    });

    test('Setting target', function() {
        var o = new (compose.class('O').extends(ObservableObject).define({
            __observable__prop: undefined
        }))();
        var p = {foo:  123};
        var b = new Binding().setSource(o, 'prop').setTarget(p, 'foo');

        strictEqual(p.foo, undefined, 'init value');
        o.prop = 555;
        strictEqual(p.foo, 555, 'changed via source');
        b.value = 666;
        strictEqual(p.foo, 666, 'changed via binding value');

    });

});
