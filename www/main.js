// setup our require stuff
require.config({

    // web root
    baseUrl: '/',

    // aliases
    paths: {
        jquery             : 'vendor/jquery',
        underscore         : 'vendor/underscore',
        backbone           : 'vendor/backbone',
    },

    // translate module names to where we moved css and less plugins
    map: {
        '*': {
            'css': 'vendor/require-css/css',
            'less': 'vendor/require-less/less',
            'text': 'vendor/text'
        }
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
    },
});

// boot the app on document ready
require(
    ['example/Application', 'manifest'],
    function(Application, manifest) {
        var app = new Application(manifest);
    }
);
