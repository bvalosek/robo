require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'            : '../src',
        'underscore'      : './vendor/underscore'
    }

});

require(['./unit/inheritance']);
require(['./unit/modifiers']);
require(['./unit/mixins']);
