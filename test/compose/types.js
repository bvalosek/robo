define(function(require) {

    var compose = require('robo/compose');
    var helpers = require('robo/compose/helpers');

    module('compose.js Type checking and Polymorphism');

    test('Object.prototype#is semantics', function() {

        var Base   = compose.defineClass();
        var Child1 = Base.extend();
        var Child2 = Child1.extend();
        var ChildA = Base.extend();
        var ChildB = ChildA.extend();

        var IThing      = compose.defineMixin({ __abstract__fn: undefined });
        var IOther      = compose.defineMixin({ __abstract__fn: undefined });
        var IOther2     = compose.defineMixin({ __abstract__fn2: undefined });
        var Child1Thing = Child1.using(IThing).extend({ __override__fn: function() {} });
        var ChildAThing = ChildA.using(IThing).extend({ __override__fn: function() {} });

        var Child1Thing2 = Child1Thing.extend();
        var ChildAThing2 = ChildAThing.extend();

        var b    = new Base();
        var c1   = new Child1();
        var c2   = new Child2();
        var ca   = new ChildA();
        var cb   = new ChildB();
        var cat  = new ChildAThing();
        var c1t  = new Child1Thing();
        var cat2 = new ChildAThing2();
        var c1t2 = new Child1Thing2();

        strictEqual(b.is(Base), true, 'base is base');
        strictEqual(c1.is(Child1), true, 'child is child');
        strictEqual(c2.is(Child2), true, 'grandchild is grandchild');

        strictEqual(c1.is(Base), true, 'child is base');
        strictEqual(c2.is(Base), true, 'grandchild is base');
        strictEqual(c2.is(Child1), true, 'grandchild is child');

        strictEqual(b.is(Child1), false, 'base is not child');
        strictEqual(b.is(Child2), false, 'base is not grandchild');
        strictEqual(c1.is(Child2), false, 'child is not grandchild');

        strictEqual(c1.is(ChildA), false, 'child is not sibling');
        strictEqual(c1.is(ChildB), false, 'child is not ...cousin?');

        strictEqual(cat.is(IThing), true, 'interface pattern');
        strictEqual(c1t.is(IThing), true, 'interface pattern');
        strictEqual(c1t.is(ChildAThing), false, 'later extened with same interface doesnt link types');

        strictEqual(cat2.is(IThing), true, 'child class w/ interface on parent');
        strictEqual(cat2.is(Child1Thing2), false, 'same interface on parent doesnt link types');

    });

});
