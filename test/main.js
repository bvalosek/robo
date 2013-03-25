require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'       : '../src',
        'underscore' : './vendor/underscore',
        'jquery'     : './vendor/jquery-1.9.1',
        'backbone'   : './vendor/backbone'
    }

});

require([
    './compose/inheritance',
    './compose/modifiers',
    './compose/mixins',
    './compose/api',
    './compose/types',
    './compose/accessors',
    './model'
]);
