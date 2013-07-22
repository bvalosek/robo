var typedef          = require('typedef');
var Collection       = require('../../lib/model/Collection');
var ObservableObject = require('../../lib/event/ObservableObject');
var Dictionary       = require('../../lib/model/Dictionary');

QUnit.module('Dictionary');

test('Basic dict', function() {

    var v = {};
    var v2 = {};

    var dict = new Dictionary();

    dict.add('a', v);
    strictEqual(dict.get('a'), v, 'add, get');
    strictEqual(dict.count(), 1, 'count');

    dict.set('b', v2);
    strictEqual(dict.get('b'), v2, 'set, get');
    strictEqual(dict.count(), 2, 'count');

    dict.remove('a');
    strictEqual(dict.get('a'), undefined, 'remove');
    strictEqual(dict.count(), 1, 'count');

});
