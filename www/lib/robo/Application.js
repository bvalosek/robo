define(function(require) {

    var Backbone        = require('backbone');
    var $               = require('jquery');
    var _               = require('underscore');

    var View            = require('./View');
    var log             = require('./log');
    var Base            = require('./Base');
    var ActivityManager = require('./ActivityManager');
    var AboutActivity   = require('./about/AboutActivity');

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
        this.activityManager = new ActivityManager(this);

        if (manifest)
            this.activityManager.loadManifest(manifest);

        // add our own activites
        this.manifestAbout();

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
        RESIZE: 'application:resize'
    };

    Application.prototype.setTitle = function(s)
    {
        document.title = s;
    };

    Application.prototype.startActivity = function(Activity, opts)
    {
        return this.activityManager.startActivity(Activity, opts);
    };

    Application.getActivities = function()
    {
        if (_instance)
            return _instance.activityManager.getActivities();

        return {};
    }

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

    Application.prototype.manifestAbout = function()
    {
        this.activityManager.manifestActivity({
            Activity: AboutActivity,
            name: 'About Robo',
            url: /^about-robo/,
            baseUrl: 'about-robo'
        });
    };

    // if we want to do anything else
    Application.prototype.onCreate = function() {};

    // gets the current user logged into the app, should be handled else where
    Application.prototype.getUserId = function() { };

    return Application;
});
