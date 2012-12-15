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

// boot the app
require(['lib/robo/bootstrap'], function(app) {

    // run after app has bootstrapped

});
