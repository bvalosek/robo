define(function(require) {

    var Backbone = require('backbone');
    var $        = require('jquery');
    var _        = require('underscore');

    var View     = require('./View');
    var log      = require('./log');
    var Base     = require('./Base');
    var Router   = require('./Router');

    // basic less
    require('less!./res/base.less');

    // singletone style
    var _instance = null;

    // creating the application
    var Application = Base.extend(function() {

        _instance = this;

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });

        // setup history and routes
        this.router = Router.factory(this);
        Backbone.history.start();

        this.onCreate();
        this.trigger(Application.ON.START);
        log('application loaded');
    });

    // stash the instance
    Application.getInstance = function()
    {
        return _instance;
    }

    // events
    Application.ON = {
        START: 'application:start',
    };

    // gets the current user logged into the app, should be handled else where
    Application.prototype.getUserId = function()
    {
        return null;
    };

    // static method to register an activity
    Application.prototype.manifestActivity = function(info, key)
    {
        this._manifest = this._manifest || {};

        if (key)
            this._manifest[key] = info;
        else
            this._manifest.push(info);

        log('new activity manifested: ' + info.name || info.caption);

        // store info back into activity
        if (info.Activity)
            info.Activity.prototype.manifest = info;
    };

    // convience method for getting activities
    Application.getActivities = function()
    {
        if (!_instance || !_instance._manifest)
            return {};

        var activities = {};
        _(_instance._manifest).each(function(x, key) {
            activities[key] = x.Activity;
        });

        return activities;
    };

    // load info from manifest
    Application.prototype.loadManifest = function(manifest)
    {
        var self = this;
        _(manifest).each(function(x, key) {
            self.manifestActivity(x, key);
        });

        this.router.check();
    };

    Application.prototype.setTitle = function(s)
    {
        document.title = s;
    };

    Application.prototype.getActivityByUrl = function(url)
    {
        var info = _(this._manifest).find(function(x) {
            return url.match(x.url);
        });

        return info ? info.Activity : null;
    };

    // start an activity
    Application.prototype.startActivity = function(Activity, opts)
    {
        var info = _(this._manifest).find(function(x) {
            return x.Activity === Activity;
        });

        if (!info)
            throw ('activity not manifested');

        log('launching activity: ' + info.name);

        this.setTitle(info.title || info.name);
        this.router.setUrl(info.baseUrl || '');

        var a = new Activity(opts);
        a.onCreate();

        // singletop for now

        this.window.appendView(a);
        this._currentActivity = a;

        // continue lifecycle
        a.onStart();
        a.onResume();
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
