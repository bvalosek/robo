var View             = require('../../lib/view/View');
var ObservableObject = require('../../lib/event/ObservableObject');
var typedef = require('typedef');

QUnit.module('View');

test('Binding creation', function() {

    var ds   = new ObservableObject({ x: 123, y: 456 });
    var ds2  = new ObservableObject({ x: 789, y: 901 });
    var view = new View({ a: undefined, b: undefined });

    view.addBinding('a', 'x');
    strictEqual(view.a, null, 'unchanged on ds-less bind');
    strictEqual(view.bindings.length, 1, 'single binding created');

    view.setDataContext(ds);
    strictEqual(view.a, 123, 'update on databind');
    ds.x = 222;
    strictEqual(view.a, 222, 'bind mapped');

    view.setDataContext(ds2);
    strictEqual(view.a, 789, 'change of data context');
    ds2.x = 333;
    strictEqual(view.a, 333, 'new bind mapped');
    ds.x = 444;
    strictEqual(view.a, 333, 'old bind not stuck');

});

