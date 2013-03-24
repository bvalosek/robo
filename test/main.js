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
    './compose/inheritance',
    './compose/modifiers',
    './compose/mixins',
    './compose/api'
]);
