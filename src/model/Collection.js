define(function(require) {

    var compose            = require('compose');
    var BackboneCollection = require('robo/backbone/Collection');

    compose.namespace('robo.model');

    return compose.class('Collection').extends(BackboneCollection).define({

        // should be overridden to point to endpoint
        __new__virtual__url: '',

        // should be overridden
        __new__virtual__model: null

    });

});
