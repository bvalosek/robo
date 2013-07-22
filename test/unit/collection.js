var typedef          = require('typedef');
var Collection       = require('../../lib/model/Collection');
var ObservableObject = require('../../lib/event/ObservableObject');

QUnit.module('Collection');

test('Basic collection', 6, function() {

    var collection = new Collection();

    var a = new ObservableObject({ x: 1 });
    var b = new ObservableObject({ y: 2 });
    var c = new ObservableObject({ z: 3 });

    collection.on('change', function() { ok(true, 'change event fired'); });
    strictEqual(collection.count(), 0, '0 length to start');
    collection.add(a); // event!
    strictEqual(collection.count(), 1, '1 after');
    a.x = 111; // event!
    collection.remove(a); // event!
    strictEqual(collection.count(), 0, '0 after remove');
    a.x = 222; // NO event!

});

test('add remove events', function() {

    var change       = 0;
    var add          = 0;
    var remove       = 0;
    var lengthChange = 0;

    var collection = new Collection();
    collection.on('change', function() { change++; });
    collection.on('add', function() { add++; });
    collection.on('remove', function() { remove++; });

    var a = new ObservableObject({ x: 1 });
    var b = new ObservableObject({ y: 2 });

    collection.add(a); // add, change, change length
    collection.add(b); // add, change, change length

    strictEqual(change, 2, 'change events');
    strictEqual(add, 2, 'add events');

    collection.remove(a); // add, change, change length
    strictEqual(change, 3, 'change events');
    strictEqual(add, 2, 'add events');
    strictEqual(remove, 1, 'remove events');

    a.x = 111; // nop
    b.y = 111; // change

    collection.remove(b); // add, change, change length
    strictEqual(change, 5, 'change events');
    strictEqual(add, 2, 'add events');
    strictEqual(remove, 2, 'remove events');

});

test('change events w/ options', 2, function() {

    var collection = new Collection();
    var a          = new ObservableObject({ x: 1 });
    var b          = new ObservableObject({ y: 2 });

    collection.on('add', function(opt) { strictEqual(opt, a, 'add option passed'); });
    collection.on('remove', function(opt) { strictEqual(opt, a, 'remove option passed'); });

    collection.add(a);
    collection.remove(a);

});

test('ObservableObject with Collection property', function() {

    var collection = new Collection();
    var parent     = new ObservableObject({ c: collection });
    var a          = new ObservableObject({ x: 1 });
    var b          = new ObservableObject({ y: 2 });

    var pChange = 0;
    var cChange = 0;

    parent.on('change', function() { pChange++; });
    collection.on('change', function() { cChange++; });

    parent.c.add(a);

    strictEqual(pChange, 1, 'parent change events');
    strictEqual(cChange, 1, 'collection change events');

    a.x = 111;
    strictEqual(pChange, 2, 'parent change events');
    strictEqual(cChange, 2, 'collection change events');

    parent.c.remove(a);
    strictEqual(pChange, 3, 'parent change events');
    strictEqual(cChange, 3, 'collection change events');

    a.x = 222;
    strictEqual(pChange, 3, 'parent change events');
    strictEqual(cChange, 3, 'collection change events');

});
