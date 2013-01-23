define(function(require) {

    var Router  = require('./Router');
    var Base    = require('./Base');
    var View    = require('./View');
    var log     = require('./log');
    var _       = require('underscore');
    var $       = require('jquery');

    // stash the app and setup a new router
    var ActivityManager = Base.extend(function(context) {
        this.context         = context;

        this._manifest       = {};
        this._verifyActivity = null;
    });

    var MAX_STACK_SIZE = 5;

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

    ActivityManager.prototype.startRouting = function()
    {
        this.router = Router.factory(this);
        Backbone.history.start();
    };

    // manifest an Activity's info so we can access it in the app
    ActivityManager.prototype.manifestActivity = function(info, key)
    {
        if (key)
            this._manifest[key] = info;
        else
            this._manifest[info.name] = info;

        // global hotkey to launch
        if (info.hotkey) {
            this.context.bindGlobalKeys(info.hotkey, function() {
                this.startActivity(info.Activity);
            });
        }

        log('new activity manifested: ' + info.name);

        // check urls
        if (info.baseUrl && (!info.baseUrl.match(info.url) || !info.url))
            log('WARNING: Route for activity is not 2-way');


        // store info back into activity
        if (info.Activity)
            info.Activity.prototype.manifest = info;
    };

    // convience method for getting activity classes
    ActivityManager.prototype.getActivities = function()
    {
        var activities = {};
        this._manifest.forEach(function(x, key) {
            activities[key] = x.Activity;
        });

        return activities;
    };

    ActivityManager.prototype.getStack = function()
    {
        return this._activityStack;
    };

    // bring up an array-like of manifests
    ActivityManager.prototype.loadManifest = function(manifest)
    {
        var self = this;
        _(manifest).each(function(x, key) {
            self.manifestActivity(x, key);
        });
    };

    // try to match on a manifested Activity's url
    ActivityManager.prototype.getActivityByUrl = function(url)
    {
        var info = _(this._manifest).find(function(x) {
            return x.url && url.match(x.url);
        });

        return info ? info.Activity : null;
    };

    // crumbs used for handling when the user presses back
    ActivityManager.prototype.goToCrumb = function(crumb)
    {
        var index = 0;
        var activity = _(this._activityStack).find(function(x, n) {
            index = n;
            return x.cid === crumb;
        });

        if (!activity)
            return false;

        // clear stack above crumb, and resume
        var toClose = this._activityStack.slice(index + 1);
        toClose.forEach(function(x) { x.close(); });

        this._resumeActivity(activity);

        return true;
    };

    // set a verifier function that returns a deferred object when logged in
    // that either resolves or fails
    ActivityManager.prototype.setAuthenticator = function(fn)
    {
        this._verifyActivity = fn;
    };

    // start an activity by class constructor
    ActivityManager.prototype.startActivity = function(Activity, opts)
    {
        var info = _(this._manifest).find(function(x) {
            return x.Activity === Activity;
        });

        if (!info)
            throw new Error('activity must be added in manifest.js');

        if (info.secure && this._verifyActivity) {
            log('activity is secure, checking verification...');

            $.when(this._verifyActivity(info))
            .then(function() {
                log('verified');
                this._addActivity(Activity, opts);
            }.bind(this));
        } else {
            this._addActivity(Activity, opts);
        }
    };

    // manage the stack -- called after we've determined we're ready to
    // actually add the activity
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
                break;
            default:
                this.asTopActivity(function() { this.onPause(); });

                // create the new activity
                log('launching new activity: ' + Activity.prototype.manifest.name);
                activity = new Activity(opts);
                activity.context = this.context;
                activity.onCreate();
                stack.push(activity);

                // render + add to DOM
                this.context.window.appendView(activity)
                    .done(function() {
                        activity.bindStaticViews();
                        activity.onStart();
                    });

                // process close event
                activity.once(View.ON.HIDE, function() {
                    this._stopActivity(activity);
                }.bind(this));

                break;
        }

        // cleanup stack if getting too big
        if (stack.length > MAX_STACK_SIZE) {
            var a = stack.shift();
            a.close();
        }

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

        fn.call(a);
    };

    // properly resume
    ActivityManager.prototype._resumeActivity = function(activity)
    {
        this.context.setTitle(activity.manifest.name || '');

        var url = activity.manifest.baseUrl || '';
        url = activity.cid + '/' + url;

        this.router.setUrl(url);
        log('stack size=' + this._activityStack.length);

        this.dumpStack();
        activity.onResume();
    };

    // debug output the activity stack
    ActivityManager.prototype.dumpStack = function()
    {
        var s = 'stack dump: ';
        this._activityStack.forEach(function(x) {
            s += ('[' + x.manifest.name + ':' + x.cid + '] ');
        });

        log(s);
    };

    // finish up properly and resume any previous activities
    ActivityManager.prototype._stopActivity = function(activity)
    {
        for (var n = 0; n < this._activityStack.length; n++)
        {
            if (this._activityStack[n] === activity) {
                this._activityStack.splice(n, 1);

                // resume the lower window
                if (!this._activityStack.length) {
                    this.context.trigger(ActivityManager.ON.WINDOW_EMPTY);
                    this.router.setUrl('');
                } else {
                    this._resumeActivity(this.getTopActivity());
                }
            }
        }
    };

    return ActivityManager;
});
