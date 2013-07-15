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

test('computed with code branches', 6, function() {

    var Obv = typedef
    .class('Obv') .extends(ObservableObject) .define({
        __observable__firstName : 'John',
        __observable__lastName  : 'Doe',
        __observable__hideName  : true,
        __computed__fullName    : function() {
            if (this.hideName)
                return '***';
            else
                return this.firstName + ' ' + this.lastName;
        }
    });

    var o = new Obv();
    o.on('change:fullName', function() { ok(1, 'change triggered'); });

    strictEqual(o.fullName, '***', 'initial val');
    o.firstName = 'Bob';
    strictEqual(o.fullName, '***', 'change out of path doesnt affect');
    o.hideName = false; // change fired
    strictEqual(o.fullName, 'Bob Doe', 'branch condition change');
    o.lastName = 'Saget'; // change fired
    strictEqual(o.fullName, 'Bob Saget', 'branch condition change');

});

test('nested deps', 4, function() {

    var Obv = typedef
    .class('Obv') .extends(ObservableObject) .define({
        __observable__firstName : 'John',
        __observable__lastName  : 'Doe',
        __observable__sex       : 'male',

        __computed__title       : function() {
            return this.sex == 'male' ? 'Mr.' : 'Mrs.'; },
        __computed__fullName    : function() {
            return this.title + ' ' + this.firstName + ' ' + this.lastName; }
    });

    var o = new Obv();
    o.on('change:fullName', function() { ok(1, 'change triggered'); });

    strictEqual(o.fullName, 'Mr. John Doe', 'initial val');
    o.sex = 'female'; // fire event
    strictEqual(o.fullName, 'Mrs. John Doe', 'initial val');
    o.title = 'asdf'; // no-op, is computed
    o.sex = 'male'; // fire event

});

test('addProperty on instance', 5, function() {

    var o = new ObservableObject();
    var o2 = new ObservableObject();

    o.addProperties({ a: 123, b: 456, });
    o.on('change', function() { ok(1, 'change all triggered'); });
    o.on('change:a', function() { ok(1, 'change a triggered'); });
    o.on('change:b', function() { ok(1, 'change b triggered'); });

    strictEqual(o.a, 123, 'init value');
    o.a = 789; // 2x triggers
    strictEqual(o.a, 789, 'init value');

    strictEqual(o2.a, undefined, 'not on other instance');
});

test('nested obs with addProperty', 8, function() {
    var O = typedef.class('O')
        .extends(ObservableObject).define();

    var o = new O({ a: 123, b: 456 });
    var p = new O({ c: 678, obv: o });

    o.on('change', function() { ok(1, 'change o all triggered'); });
    o.on('change:a', function() { ok(1, 'change o a triggered'); });
    p.on('change', function() { ok(1, 'change p all triggered'); });
    p.on('change:obv', function() { ok(1, 'change p obv triggered'); });

    o.a   = 456; // 4x trigger
    p.obv = 567; // 2x trigger
    o.a   = 777; // only trigger 2x
});

