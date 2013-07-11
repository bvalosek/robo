var WithEvents = require('../event/WithEvents');
var typedef    = require('typedef');
var _          = require('underscore');

// Starting point for a Robo app. Call start() to boot up
var Application = typedef
.class('Application').uses(WithEvents).define({

    _started           : false,
    __static__instance : null,
    currentController  : null,
    routes             : null,

    __events__: [
        'onStart',
        'badRoute'
    ],

    __constructor__: function()
    {
        if (Application.instance !== null)
            throw new Error('Can only instantiate one application at a time');

        Application.instance = this;

        this.routes      = [];

        // ensure event decorations are bound
        this.initEvents();
    },

    __static__getInstance: function()
    {
        return Application.instance;
    },

    // Route to something. We let the Application be in charge of routing any
    // of our URIs to various parts of the application
    __fluent__route: function(r)
    {
        var _this = this;

        var route = _(this.routes).find(function(route) {

            // matching on URI regex
            if (r && r.uri && r.uri.match(route.uri))
                return true;
        });

        if (!route) {
            this.trigger(Application.events.badRoute);
            return this;
        }

        Log.d('found route to controller ' + route.controller.__name__);
        return this;
    },

    // Take a hash of routes to controllers and ensure when we hit a URL, we
    // route to it
    __fluent__addRoutes: function(routes)
    {
        this.routes = this.routes.concat(routes);
    },

    __fluent__start: function()
    {
        if (this._started)
            throw new Error('Application already started');

        // got em
        this._started = true;
        this.trigger(Application.events.onStart);
        return this;
    }

});

module.exports = Application;
