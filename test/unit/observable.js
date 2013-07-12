var typedef          = require('typedef');
var ObservableObject = require('../../lib/event/ObservableObject');
var WithEventLogging = require('../../lib/util/WithEventLogging');

QUnit.module('ObservableObject');

test('Simple change trigger', 4, function() {

    var O = typedef.class('O').extends(ObservableObject).define({
        __observable__prop: 123
    });

    var o = new O();
    o.on('change', function() { ok(true, 'value triggered'); });
    strictEqual(o.prop, 123, 'initial value');

    o.prop = 234;
    o.prop = 234; // nop
    o.prop = null;
    o.prop = null; // nop
    o.prop = undefined;
    o.prop = undefined; // nop

});

test('specific value change', 1, function() {

    var O = typedef.class('O').extends(ObservableObject).define({
        __observable__prop: 123,
        __observable__foo: 123
    });

    var o = new O();

    o.on('change:prop', function() { ok(true, 'specific val triggerd'); });
    o.prop = 444;
    o.prop = 444; // nop
    o.foo = 444;

});

test('observable observable', 4, function() {
    var O = typedef.class('O').extends(ObservableObject).define({
        __observable__prop: 123,
        __observable__foo: 123
    });

    var o = new O();
    var p = new O();

    o.on('change:prop', function() { ok(true, 'specific val triggerd'); });

    o.prop = p;
    p.foo = 444;
    p.prop = 444;
    o.prop = null;
    p.prop = 999; // noop;

});

test('reflection stuff', function() {

    var O = typedef.class('O').extends(ObservableObject).define({
        __observable__someProp: 1,
    });

    strictEqual(O.somePropProperty, 'someProp', 'property constant');

});

test('computed basics', 3, function() {

    var Obv = typedef
    .class('Obv') .extends(ObservableObject) .define({
        __observable__firstName : 'John',
        __observable__lastName  : 'Doe',
        __computed__fullName    : function() { return this.firstName + ' ' + this.lastName; }
    });

    var o = new Obv();

    o.on('change:fullName', function() { ok(1, 'change triggered'); });


    strictEqual(o.fullName, 'John Doe', 'basic access with default observable values');

    o.firstName = 'Bob';
    strictEqual(o.fullName, 'Bob Doe', 'basic access with mutated observable values');

});
