define(function(require) {

    var Backbone    = require('backbone');
    var $           = require('jquery');
    var _           = require('underscore');

    var View = require('lib/robo/View');
    var log = require('lib/robo/log');

    // creating the application
    var Application = function() {

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });

        // setup history and routes
        Backbone.history.start();

        this.trigger(Application.ON.START);
        log('application loaded');
    };

    // events
    Application.ON = {
        START: 'application:start',
    };

    // register an Activity and all its info
    Application.prototype.manifestActivity = function(info)
    {
        this.activityManifest = this.activityManifest || [];
        this.activityManifest.push(info);
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

    return Application;
});
