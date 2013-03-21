define(function(require) {

    var compose = require('robo/compose');
    var helpers = require('robo/compose/helpers');
    var _       = require('underscore');

    module('compose.Object API & consistency');

    test('Verify type and presence on root Object', function() {

        // check root, somethikng extended from root, and something extended from an extended
        var check = [compose.Object, compose.Object.extend(), compose.Object.extend().extend()];

        for (var n in check) {
            var O = check[n];
            strictEqual(_(O.extend).isFunction(), true, 'Object#extend is function: level ' + n);
            strictEqual(_(O.using).isFunction(), true, 'Object#using is function: level ' + n);
            strictEqual(_(O.findAnnotations).isFunction(), true, 'Object#findAnnotations is function: level ' + n);
            strictEqual(_(O.findMembers).isFunction(), true, 'Object#findMembers is function: level ' + n);
            strictEqual(_(O.prototype.is).isFunction(), true, 'Object.prototype#is is function: level ' + n);
            strictEqual(_(O.prototype.mixin).isFunction(), true, 'Object.prototype#mixin is function: level ' + n);

            // constructor stuff
            strictEqual(O, O.prototype.constructor, 'constructor is correct on prototype level ' + n);
            strictEqual(new O().is(O), true, 'object is its own self: level ' + n);

            // ensure the object is empty from enumerable things
            deepEqual(_(O).keys(), [], 'no enumerable properites on object level ' + n);
            deepEqual(_(O.prototype).keys(), [], 'no enumerable properites on object prototype level ' + n);
        }

    });

});
