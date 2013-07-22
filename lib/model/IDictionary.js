module.exports = IDictionary = require('typedef')

// Used to indicate we can treat an object as a hash-like thing to store
// key/value pairs
.interface('IDictionary') .define({

    // Insert key value pair. Will trigger a change event every time, and a
    // specific change event if the key exists with a different value. Triggers
    // an add event if the key is new
    __fluent__add: function(key, value) {},

    // Remove element under key. Triggers a change and remove event if they key
    // exists
    __fluent__remove: function(key) {},

    // Reset the hash, emits a change and clear event if the hash isn't empty
    __fluent__clear: function() {},

    // Change an existing key. Defers to add if the key doesn't exist. Triggers
    // a change event if the value is idfferent
    __fluent__set: function(key, value) {},

    // Boolean on whether hash already has a key
    containsKey: function(key) {},

    // Get a value of a certain key
    get: function(key) {},

    // Size of stuff
    count: function() {}

});
