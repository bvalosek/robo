define(function(require, exports) {

    var _ = require('underscore');

    // load all of the activities we'll need
    _(exports).extend({
        ExampleActivity: { 
            Activity: require('example/ExampleActivity'),
            name: 'Example Activity',
            url: /^$|^example.*/,
            baseUrl: 'example'
        },
        AnotherActivity: { 
            Activity: require('example/AnotherActivity'),
            name: 'Another Activity',
            url: /^another.*/,
            baseUrl: 'another'
        }
    });
});
