module.exports = IDictionary = require('typedef')

// Used to indicate we can treat an object as a hash-like thing to store
// key/value pairs
.interface('IDictionary') .define({

    // Insert key value pair
    __fluent__add: function(key, value) {},

    // Remove element under key
    __fluent__remove: function(key) {},

    // Reset
    __fluent__clear: function() {},

    // Get a value of a certain key
    get: function(key) {},

    // Size of stuff
    count: function() {}

});
