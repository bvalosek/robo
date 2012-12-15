// setup our require stuff
require.config({

    baseUrl: '/',

    paths: {
        jquery: 'vendor/jquery',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
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

// make sure to load the app module to initialize
require(['src/app'], function(app) {

    app.window.print('Hello, World!');

});
