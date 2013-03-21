require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'            : '../src',
        'underscore'      : './vendor/underscore'
    }

});

require([
    './unit/inheritance',
    './unit/modifiers',
    './unit/mixins',
    './unit/bmixins'
]);
