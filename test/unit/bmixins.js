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
        // tests

        raises(function() {
            var a = new IThing();
        }, null, 'Prevent instantiation of abstract class');

        console.log(helpers.prettySig(Thing));
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

        console.log(helpers.prettySig(ThingAgain));
        deepEqual(
            Thing.getSignature(),
            ThingAgain.getSignature(),
            'Empty extend yields same signature');
    });

});
