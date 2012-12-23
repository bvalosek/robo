require.config({

    // web root
    baseUrl: '/',

    // aliases
    paths: {
        'robo'         : 'lib/robo',

        'jquery'       : 'vendor/jquery',
        'underscore'   : 'vendor/underscore',
        'backbone'     : 'vendor/backbone',
        'text'         : 'vendor/text',
        'require-css'  : 'vendor/require-css',
        'require-less' : 'vendor/require-less'
    },

    // request translations
    map: {
        '*': {
            'css'  : 'require-css/css',
            'less' : 'require-less/less',
        }
    },

    // build opts
    out                     : 'main.built.js',
    name                    : 'main',
    include                 : ['css', 'manifest', 'require-css/normalize'],

    optimize                : 'uglify2',

    preserveLicenseComments : false,

    // don't include less stuff
    excludeShallow: [
        'require-css/css-builder',
        'require-less/lessc-server',
        'require-less/lessc'
    ]
});

require(

    // initial modules to load
    ['example/SampleApplication', 'manifest'],

    // kick it off
    function(Application, manifest) {
        new Application(manifest);
    }
);
