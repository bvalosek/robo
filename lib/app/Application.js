var WithEvents = require('../event/WithEvents');
var compose    = require('compose');

// Starting point for a Robo app. Call start() to boot up
var Application = compose.class('Application').uses(WithEvents).define({

    _started: false,

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

    // Route to something
    __fluent__route: function(uri)
    {
        this.router.navigate(uri, {trigger: true});
        return this;
    },

    __static__instance: null,

    // Called when
    __fluent__start: function()
    {
        if (this._started)
            throw new Error('Application already started');

        // got em
        this._started = true;
        this.onStart();
        return this;
    },

    // Override to do stuff on app boot
    __virtual__onStart: function() {}

});

module.exports = Application;
