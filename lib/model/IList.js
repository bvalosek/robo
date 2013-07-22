module.exports = IList = require('typedef')

// This interface is for anything to implement that has list-like behavior, so
// we can detect when we can add/remove stuff. Effectively functions like an
// array, indexed
.interface('IList') .define({

    // Insert an item at the end of the the list. Should trigger a change and
    // add event every time
    __fluent__add: function(value) {},

    // Remove first occurances of a value. Should trigger a change and remove
    // event if the value is found, if not, nop
    __fluent__remove: function(value) {},

    // Same as remove, but at a specific index
    __fluent__removeAt: function(index) {},

    // Reset the list. If the list is not empty, trigger a clear and change
    // event
    __fluent__clear: function() {},

    // Get an item at an index
    get: function(index) {},

    // Numbered index of a value
    indexOf: function(value) {},

    // Total size of the list
    count: function() {}

});
