module.exports = IList = require('typedef')

// This interface is for anything to implement that has list-like behavior, so
// we can detect when we can add/remove stuff. Effectively functions like an
// array, indexed
.interface('IList') .define({

    // Insert an item at the end of the the list
    __fluent__add: function(value) {},

    // Remove all occurances of a value
    __fluent__remove: function(value) {},

    // Reset the list
    __fluent__clear: function() {},

    // Get an item at an index
    get: function(index) {},

    // Numbered index of a value
    indexOf: function(value) {},

    // Total size of the list
    count: function() {}

});
