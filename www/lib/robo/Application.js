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
    var Application = Base.extend(function(manifest) {

        _instance = this;

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });

        // setup history and routes
        this.router = Router.factory(this);
        Backbone.history.start();

        if (manifest)
            this.loadManifest(manifest);

        // setup trigger for resize
        var self = this;
        $(window).resize(_.debounce(function() {
            self.trigger(Application.ON.RESIZE);
        }, 500));

        this.onCreate();
        log('application loaded');
    });

    // stash the instance
    Application.getInstance = function()
    {
        return _instance;
    }

    // events
    Application.ON = {
        WINDOW_EMPTY: 'application:window-empty',
        RESIZE: 'application:resize'
    };

    Application.ACTIVITY_LAUNCH_MODE = {
        STANDARD        : 1,
        SINGLE_TOP      : 2,
        SINGLE_INSTANCE : 3
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
            throw new Error('activity must be added in manifest.js');

        this._addActivity(Activity, opts);
    };

    // manage the stack
    Application.prototype._addActivity = function(Activity, opts)
    {
        if (!this._activityStack)
            this._activityStack = [];
        var stack = this._activityStack;

        var activity;

        // how to launch
        switch (Activity.prototype.manifest.launchMode) {
            case Application.ACTIVITY_LAUNCH_MODE.SINGLE_TOP:
                break;
            case Application.ACTIVITY_LAUNCH_MODE.SINGLE_INSTANCE:
                break;
            case Application.ACTIVITY_LAUNCH_MODE.STANDARD:
            default:
                this.asTopActivity(function() { this.onPause() });

                // create the new activity and add to DOM
                log('launching new activity: ' + Activity.prototype.manifest.name);
                activity = new Activity(opts);
                activity.onCreate();
                stack.push(activity);
                this.window.appendView(activity);
                activity.onStart();

                // process close event
                var self = this;
                activity.once(View.ON.HIDE, function() {
                    self._stopActivity(activity);
                });

                break;
        }

        // cleanup stack if needed
        if (stack.length > 5) {
            var a = stack.shift();
            a.close();
        }

        log('stack.length=' + stack.length);
        this._resumeActivity(activity);
    };

    Application.prototype.getTopActivity = function()
    {
        if (!this._activityStack)
            return;
        return this._activityStack[this._activityStack.length - 1];
    };

    // run an arbitrary function in the context of the top activity
    Application.prototype.asTopActivity = function(fn)
    {
        var a = this.getTopActivity();

        if (!a)
            return;

        _(fn).bind(a)();
    };

    // properly resume
    Application.prototype._resumeActivity = function(activity)
    {
        this.setTitle(activity.manifest.name || '');
        this.router.setUrl(activity.manifest.baseUrl || '');

        activity.onResume();
    };

    // finish up properly and resume any previous activities
    Application.prototype._stopActivity = function(activity)
    {
        for (var n = 0; n < this._activityStack.length; n++)
        {
            if (this._activityStack[n] === activity) {
                this._activityStack.splice(n, 1);

                // resume the lower window
                if (!this._activityStack.length)
                    this.trigger(Application.ON.WINDOW_EMPTY);
                else
                    this._resumeActivity(this.getTopActivity());
            }
        }
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
