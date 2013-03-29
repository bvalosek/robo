require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'       : '../src',
        'compose'    : '../components/compose/compose',
        'underscore' : '../components/underscore-amd/underscore',
        'jquery'     : '../components/jquery/jquery',
        'backbone'   : '../components/backbone-amd/backbone'
    }

});

require([
    './unit/model'
]);
