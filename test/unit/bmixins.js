define(function(require) {

    var compose = require('robo/compose');
    var helpers = require('robo/compose/helpers');

    module('brandon mixin semanics');

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
        // sigs

        console.log(helpers.prettySig(Thing));
        console.log(helpers.prettySig(ThingAgain));

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
        // sigs

        console.log('\n\n');
        console.log(helpers.prettySig(Child1));
        console.log(helpers.prettySig(Child2));
        console.log(helpers.prettySig(Child3));
        console.log(helpers.prettySig(Child2A));
        console.log(helpers.prettySig(Child2B));

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
