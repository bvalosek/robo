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
            ok(_(O.extend).isFunction(), 'Object#extend is function: level ' + n);
            ok(_(O.using).isFunction(), 'Object#using is function: level ' + n);
            ok(_(O.findAnnotations).isFunction(), 'Object#findAnnotations is function: level ' + n);
            ok(_(O.findMembers).isFunction(), 'Object#findMembers is function: level ' + n);
            ok(_(O.prototype.is).isFunction(), 'Object.prototype#is is function: level ' + n);
            ok(_(O.prototype.mixin).isFunction(), 'Object.prototype#mixin is function: level ' + n);

            // constructor stuff
            ok(O === O.prototype.constructor, 'constructor is correct on prototype level ' + n);
            ok(new O().is(O), 'object is its own self: level ' + n);

            // ensure the object is empty from enumerable things
            deepEqual(_(O).keys(), [], 'no enumerable properites on object level ' + n);
            deepEqual(_(O.prototype).keys(), [], 'no enumerable properites on object prototype level ' + n);
        }

    });

});
