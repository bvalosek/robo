define(function(require) {

    var Backbone    = require('backbone');

    var log         = require('./log');

    var Router = Backbone.Router.extend({
        routes: {
            '*url' : 'router'
        }
    });

    Router.prototype.router = function(url)
    {
        url = url.replace('!/','');
    };

    return Router;
});
