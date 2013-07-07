require.config({

    // web root
    baseUrl: './',

    // aliases
    paths: {
        'robo'       : '../src',
        'compose'    : '../bower_components/composejs/compose',
        'underscore' : '../bower_components/underscore-amd/underscore',
        'text'       : '../bower_components/requirejs-text/text'
    }

});

// Load all of our tests
define(function(require) {

    require('unit/event');
    require('unit/event-dom');
    require('unit/binding');
    require('unit/observable');

    start();

});
