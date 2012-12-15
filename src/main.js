require.config({

    paths: {
        jquery: '/vendor/jquery',
        underscore: '/vendor/underscore',
        backbone: '/vendor/backbone',
    },

    // non-AMD modules
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
    }
});

require([], function() {

    console.log('Hello, World!');

});
