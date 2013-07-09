var WithEvents = require('../event/WithEvents');
var compose    = require('compose');

// Starting point for a Robo app. Call start() to boot up
var Application = compose.class('Application').uses(WithEvents).define({

    _started: false,

    __static__instance: null,

    __promise__started: null,

    __constructor__: function()
    {
        if (Application.instance !== null)
            throw new Error('Can only instantiate one application at a time');

        Application.instance = this;
    },

    getInstance: function()
    {
        return Application.instance;
    },

    // Route to something. We let the Application be in charge of routing any
    // of our URIs to various parts of the application (mapped to controllers,
    // which instantiate fragments)
    __fluent__route: function(uri)
    {
        return this;
    },

    // Take a hash of routes to controllers and ensure when we hit a URL, we
    // route to it
    __fluent__setupRoutes: function(routes)
    {
    },

    __fluent__start: function()
    {
        if (this._started)
            throw new Error('Application already started');

        // got em
        this._started = true;
        return this;
    }

});

module.exports = Application;
