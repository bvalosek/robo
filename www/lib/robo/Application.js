define(function(require) {

    var Backbone = require('backbone');
    var $        = require('jquery');
    var _        = require('underscore');

    var View     = require('./View');
    var log      = require('./log');
    var Base     = require('./Base');

    // creating the application
    var Application = Base.extend(function() {

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });

        // setup history and routes
        Backbone.history.start();

        this.trigger(Application.ON.START);
        log('application loaded');
    });

    // stash the instance
    Application.instance = null;

    // events
    Application.ON = {
        START: 'application:start',
    };

    // static method to register an activity
    var _manifest = [];
    Application.manifestActivity = function(info)
    {
        _manifest.push(info);

        log('Activity manifested: ' + info.name || info.caption);

        // store info back into activity
        if (info.Activity)
            info.Activity.prototype.manifest = info;
    };

    // fire off
    Application.prototype.trigger = function(eventName, opts)
    {
        this._events.trigger(eventName, opts);
        log('event bus: ' + eventName);
    };

    // attach to
    Application.prototype.bind = function(eventName, fn, context)
    {
        this._events.on(eventName, fn, context);
    };

    // clear events
    Application.prototype.off = function(eventName, fn, context)
    {
        this._events.off(eventName, fn, context);
    };

    // if we want to do anything else
    Application.prototype.onCreate = function() {};

    return Application;
});
