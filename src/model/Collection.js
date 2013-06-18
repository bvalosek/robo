define(function(require) {

    var compose            = require('compose');
    var BackboneCollection = require('robo/backbone/Collection');
    var Observable         = require('robo/event/Observable');

    return compose.class('Collection').extends(BackboneCollection).define({

        // should be overridden to point to endpoint
        __new__virtual__url: '',

        // should be overridden
        __new__virtual__model: null

    });

});
