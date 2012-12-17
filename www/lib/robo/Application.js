define(function(require) {

    var Backbone = require('backbone');
    var $        = require('jquery');
    var _        = require('underscore');

    var View     = require('./View');
    var log      = require('./log');
    var Base     = require('./Base');
    var Router   = require('./Router');

    // creating the application
    var Application = Base.extend(function() {

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });

        // setup history and routes
        this.router = new Router(this);
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

        log('new activity manifested: ' + info.name || info.caption);

        // store info back into activity
        if (info.Activity)
            info.Activity.prototype.manifest = info;
    };

    // start an activity
    Application.prototype.startActivity = function(Activity, opts)
    {
        var info = _(_manifest).find(function(x) {
            return x.Activity === Activity;
        });
        log('launching activity: ' + info.name);

        var a = new Activity(opts);
        a.onCreate();

        // singletop for now
        this.window.setView(a).done(function() {
            a.onStart();
            a.onResume();
        });
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
