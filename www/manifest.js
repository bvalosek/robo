define(function(require, exports) {

    var _ = require('underscore');

    // load all of the activities we'll need against the exports proxy object
    // so we don't have to worry about it actually being loaded at startup
    _(exports).extend({
        ExampleActivity: {
            Activity: require('example/ExampleActivity'),
            name: 'Example Activity',
            url: /^$/,
            baseUrl: 'example'
        },
        UglyActivity: {
            Activity: require('example/UglyActivity'),
            name: 'Ugly Activity',
        }
    });
});
