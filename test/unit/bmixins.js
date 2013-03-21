define(function(require) {

    var compose = require('robo/compose');
    var helpers = require('robo/compose/helpers');

    module('brandon mixin semanics');

    test('Using a mixin as an interface pattern', function() {

        var IThing = compose.defineMixin({
            __name__: 'IThing',

            __abstract__fn                   : undefined,
            __abstract__readonly__readonlyFn : undefined
        });

        var Child1 = compose.defineClass({
            fn: function() {}
        });

        var Child = compose.Object.extend({
            __name__: 'Child'
        });

        raises(function() {
            var a = new IThing();
        }, null, 'Prevent instantiation of abstract class');

    });

});
