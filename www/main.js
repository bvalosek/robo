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
        'require-less' : 'vendor/require-less',
        'keymage'      : 'vendor/keymage',
        'font-awesome' : 'vendor/font-awesome'
    },

    // request translations
    map: {
        '*': {
            'css'       : 'require-css/css',
            'less'      : 'require-less/less',

            // require for css-builder hack
            'normalize' : 'require-css/normalize'
        }
    },

    // build opts
    out                     : 'main.built.js',
    skipDirOptimize         : true,
    name                    : 'main',

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
    ['example/SampleApplication', 'manifest', 'css'],

    // kick it off
    function(Application, manifest) {
        new Application(manifest);
    }
);
