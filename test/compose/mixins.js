define(function (require)
{
    var compose = require('robo/compose');
    var helpers = require('robo/compose/helpers');

    module('compose.js Mixins');

    test('Mixins', function ()
    {
        var BaseMix = compose.defineClass({
            __virtual__render: function ()
            {
                return 'base render';
            }
        });

        var RenderMix = compose.defineMixin({
            __wrapped__render: function (render)
            {
                return 'mix ' + render();
            },

            newMix: function ()
            {
                return 'new mix';
            }
        });

        var MixChild = BaseMix.using(RenderMix).extend({

        });


        var mixChild = new MixChild();
        equal(mixChild.render(), 'mix base render');
        equal(mixChild.newMix(), 'new mix');

        var OverrideMixChild = BaseMix.using(RenderMix).extend({
            __override__render: function ()
            {
                return 'overridden render';
            }
        });

        var overrideMixChild = new OverrideMixChild();
        equal(overrideMixChild.render(), 'overridden render');

    });

    test('Mixin Inheritance', function ()
    {
        var Child1 = compose.defineClass({
            __name__: 'Child1'
        });
        
        var Child2 = Child1.extend({
            __name__: 'Child2'
        });

        equal(Child2.__name__, 'Child2', 'Self Name');
        equal(Child2.Super.__name__, 'Child1', 'Super name');

        var TestMix = compose.defineMixin({
            __name__: 'TextMix',

            newMix: function ()
            {
                return 'new mix';
            }
        });

        var ChildM = Child2.using(TestMix);
        equal(ChildM.Super.__name__, 'Child1', 'Mixin super name');

        var ChildME = ChildM.extend({
            __name__: 'ChildME'
        });

        console.log(helpers.prettySig(Child1));
        console.log(helpers.prettySig(Child2));
        console.log(helpers.prettySig(ChildM));
        console.log(helpers.prettySig(ChildME));

        equal(ChildME.Super.Super.__name__, 'Child1', 'Extended mixin grandparent name');

        var ChildMixDirect = Child2.using(TestMix).extend({
            __name__: 'ChildMixDirect'
        });
        equal(ChildMixDirect.Super.Super.__name__, 'Child1', 'Direct Extended mixin grandparent name');

    });

    test('Mixin Ordering', function ()
    {
        var fakeGlobal = '';

        var Base = compose.defineClass({
            __name__: 'Base',
            __virtual__print: function ()
            {
                fakeGlobal += '2';
            }
        });

        var MixBefore = compose.defineMixin({
            __name__: 'MixBefore',
            __before__print: function ()
            {
                fakeGlobal += '1';
            }
        });

        var MixAfter = compose.defineMixin({
            __name__: 'MixAfter',
            __after__print: function ()
            {
                fakeGlobal += '3';
            }
        });

        var MixWrap = compose.defineMixin({
            __name__: 'MixWrap',
            __wrapped__print: function (print)
            {
                fakeGlobal += '0';
                print();
                fakeGlobal += '4';
            }
        });

        var BaseBefore = Base.using(MixBefore);
        var BaseAfter = BaseBefore.using(MixAfter);
        var BaseWrap = BaseAfter.using(MixWrap);

        var baseWrap = new BaseWrap();
        baseWrap.print();
        equal(fakeGlobal, '01234');
    });

    test('Using a mixin as an interface pattern', function() {

        // --------------------------------------------------------------------
        // setup classes

        var IThing = compose.defineMixin({
            __name__: 'IThing',

            __abstract__fn                   : undefined,
            __abstract__readonly__readonlyFn : undefined
        });

        var Child = compose.Object.extend({
            __name__: 'Child',
            fn: function() {}
        });

        var Thing      = compose.Object.using(IThing);
        var ThingAgain = Thing.extend({ __name__  : 'ThingAagain' });

        // --------------------------------------------------------------------
        // tests

        raises(function() {
            var a = new IThing();
        }, null, 'Prevent instantiation of abstract class');

        deepEqual(
            Thing.findAnnotations('fn'),
            {ABSTRACT: true, MIXIN: true},
            'Class mixed with interface retains abstract annotation + mixin annotation');

        deepEqual(
            Thing.findAnnotations('readonlyFn'),
            {ABSTRACT: true, READONLY: true, MIXIN: true},
            'Class mixed with interface carries forward base annotations + mixin');

        deepEqual(
            Child.findAnnotations('fn'),
            {},
            'no annotations on mixed-on-top-off matching function');

        deepEqual(
            Thing.getSignature(),
            ThingAgain.getSignature(),
            'Empty extend yields same signature');

        equal(helpers.isAbstract(Thing), true, 'Class from interface is abstract');

    });

    test('Mixin Super vs __SuperDuper__ propigation', function() {

        // --------------------------------------------------------------------
        // setup classes

        var Child1 = compose.Object.extend({ __name__: 'Child1' });
        var Child2 = Child1.extend({ __name__: 'Child2' });
        var Child3 = Child2.extend({ __name__: 'Child3' });

        var MixA = compose.defineMixin({ __name__: 'MixA' });
        var MixB = compose.defineMixin({ __name__: 'MixB' });
        var MixC = compose.defineMixin({ __name__: 'MixC' });

        var Child2A = Child2.using(MixA);
        var Child2B = Child2.using(MixB);

        // --------------------------------------------------------------------
        // tests

        ok(new Child1().is(compose.Object), 'Child1 instance is a Object');
        ok(new Child2().is(Child1), 'Child2 instance is a Child1');
        ok(new Child3().is(Child1), 'Child3 instance is a Child1');
        ok(!new Child1().is(Child3), 'Child1 instance is not a Child3');

        ok(Child1.Super === compose.Object, 'Child1 Super is Object');
        ok(Child2.Super === Child1, 'Child2 Super is Child1');
        ok(Child3.Super === Child2, 'Child3 Super is Child2');

        ok(Child2A.Super === Child2.Super, 'Bare mixin class should leave Super intact');
        ok(Child2A.Super === Child2B.Super, 'Bare mixin classes from same base class should have same Super');

        ok(Child2A.__SuperDuper__.Super === Child2.Super, 'Bare mixin class __SuperDuper__\'s Super should be the faked Super');

    });
});
