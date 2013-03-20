require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'            : '../src',
        'underscore'      : './vendor/underscore'
    }

});

require(['test']);
