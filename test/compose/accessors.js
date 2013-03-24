define(function(require) {

    var compose = require('robo/compose');

    module('compose.js Class accessors and properties');

    test('changing primative base properties doesn\'t weirdly effect related classes', function() {

        var Base = compose.defineClass({

            normal                  : 0,
            __readonly__ro          : 1,
            __hidden__h             : 2,
            __readonly__hidden__roh : 3,
            __property__p           : 4,
            __property__result__pr  : 5
        });

        var Child1 = Base.extend();

        var b = new Base();
        var c1 = new Child1();

        b.normal = -1;
        b.ro     = -1;
        b.h      = -1;
        b.roh    = -1;
        b.p      = -1;
        b.pr     = -1;

        strictEqual(c1.normal, 0, 'no annotations');
        strictEqual(c1.ro, 1, 'readonly');
        strictEqual(c1.h, 2, 'hidden');
        strictEqual(c1.roh, 3, 'readonly hidden');
        strictEqual(c1.p, 4, 'property');
        strictEqual(c1.pr, 5, 'property result');

    });

    test('force proto annotation when initializing to an object', function() {

        raises(function () {
            var Base = compose.defineClass({ prop: {} });
        }, 'thow error when using object to init member');

        ok(function () {
            var Base = compose.defineClass({ __proto__prop: {} });
            return true;
        }, 'proto keyword allows usage of object initial');


    });

});
