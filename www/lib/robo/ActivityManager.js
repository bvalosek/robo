define(function(require) {

    var Router = require('./Router');
    var Base   = require('./Base');
    var View   = require('./View');
    var log    = require('./log');

    var _      = require('underscore');

    // stash the app and setup a new router
    var ActivityManager = Base.extend(function(context) {
        this.context = context;

        this._manifest = {};

        this.router = Router.factory(this);
        Backbone.history.start();
    });

    // events
    ActivityManager.ON = {
        WINDOW_EMPTY: 'robo-activity-manager:window-empty'
    };

    // stack management
    ActivityManager.LAUNCH_MODE = {
        STANDARD        : 1,
        SINGLE_TOP      : 2,
        SINGLE_INSTANCE : 3
    };

    ActivityManager.prototype.manifestActivity = function(info, key)
    {
        if (key)
            this._manifest[key] = info;
        else
            this._manifest.push(info);

        log('new activity manifested: ' + info.name || info.caption || '[NO NAME]');

        // store info back into activity
        if (info.Activity)
            info.Activity.prototype.manifest = info;
    };

    // convience method for getting activity classes
    ActivityManager.prototype.getActivities = function()
    {
        var activities = {};
        _(this._manifest).each(function(x, key) {
            activities[key] = x.Activity;
        });

        return activities;
    };

    // load info from manifest
    ActivityManager.prototype.loadManifest = function(manifest)
    {
        var self = this;
        _(manifest).each(function(x, key) {
            self.manifestActivity(x, key);
        });

        this.router.check();
    };

    ActivityManager.prototype.getActivityByUrl = function(url)
    {
        var info = _(this._manifest).find(function(x) {
            return url.match(x.url);
        });

        return info ? info.Activity : null;
    };

    // start an activity
    ActivityManager.prototype.startActivity = function(Activity, opts)
    {
        var info = _(this._manifest).find(function(x) {
            return x.Activity === Activity;
        });

        if (!info)
            throw new Error('activity must be added in manifest.js');

        this._addActivity(Activity, opts);
    };

    // manage the stack
    ActivityManager.prototype._addActivity = function(Activity, opts)
    {
        if (!this._activityStack)
            this._activityStack = [];
        var stack = this._activityStack;

        var activity;

        // how to launch
        switch (Activity.prototype.manifest.launchMode) {
            case ActivityManager.LAUNCH_MODE.SINGLE_TOP:
                break;
            case ActivityManager.LAUNCH_MODE.SINGLE_INSTANCE:
                break;
            case ActivityManager.LAUNCH_MODE.STANDARD:
            default:
                this.asTopActivity(function() { this.onPause() });

                // create the new activity and add to DOM
                log('launching new activity: ' + Activity.prototype.manifest.name);
                activity = new Activity(opts);
                activity.onCreate();
                stack.push(activity);
                this.context.window.appendView(activity);
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

    ActivityManager.prototype.getTopActivity = function()
    {
        if (!this._activityStack)
            return;
        return this._activityStack[this._activityStack.length - 1];
    };

    // run an arbitrary function in the context of the top activity
    ActivityManager.prototype.asTopActivity = function(fn)
    {
        var a = this.getTopActivity();

        if (!a)
            return;

        _(fn).bind(a)();
    };

    // properly resume
    ActivityManager.prototype._resumeActivity = function(activity)
    {
        this.context.setTitle(activity.manifest.name || '');
        this.router.setUrl(activity.manifest.baseUrl || '');

        activity.onResume();
    };

    // finish up properly and resume any previous activities
    ActivityManager.prototype._stopActivity = function(activity)
    {
        for (var n = 0; n < this._activityStack.length; n++)
        {
            if (this._activityStack[n] === activity) {
                this._activityStack.splice(n, 1);

                // resume the lower window
                if (!this._activityStack.length)
                    this.context.trigger(ActivityManager.ON.WINDOW_EMPTY);
                else
                    this._resumeActivity(this.getTopActivity());
            }
        }
    };

    return ActivityManager;
});
