var typedef          = require('typedef');
var WithDeferred       = require('../../lib/async/WithDeferred');

QUnit.module('Async');

asyncTest('WithDeferred', function() {
    var O = typedef.class('O').uses(WithDeferred).define({
        __deferred__deferred: undefined
    });

    var o = new O();
    o.deferred.done(function() {
        ok(1, 'setting deferred resolves promise');
        start();
    });
    o.deferred = 3;
});

