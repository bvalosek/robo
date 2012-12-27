define(function(require) {

    var Backbone        = require('backbone');
    var $               = require('jquery');
    var _               = require('underscore');

    var View            = require('./View');
    var log             = require('./log');
    var Base            = require('./Base');
    var ActivityManager = require('./ActivityManager');
    var KeyManager      = require('./KeyManager');

    var manifest        = require('manifest');

    var SYS_CHORD = 'defmod-shift-/ ';

    // less files
    require('less!./res/base.less');

    // singletone style
    var _instance = null;

    // creating the application
    var Application = Base.extend(function() {

        _instance = this;
        this.onCreate();

        // setup events
        this._events = _({}).extend(Backbone.Events);

        // main view
        this.window = new View({ el: $('body') });
        this.window.$el.html('');

        // shortcut keys
        this.keyManager = new KeyManager(this);

        // setup history and routes
        this.activityManager = new ActivityManager(this);

        // setup trigger for resize
        var self = this;
        this.window.$el.resize(_.debounce(function() {
            self.trigger(Application.ON.RESIZE);
        }, 500));


        // add user and system activites
        this.manifestSystemActivities();
        this.activityManager.loadManifest(manifest);
        this.onStart();

        // get the party started
        this.activityManager.startRouting();
        this.onResume();

        log('application loaded');
    });

    // stash the instance
    Application.getInstance = function()
    {
        return _instance;
    };

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

    Application.prototype.getActivities = function()
    {
        return this.activityManager.getActivities();
    };

    // app-global key bind
    Application.prototype.bindGlobalKeys = function(keys, fn)
    {
        this.keyManager.addKey(keys, this, fn);
    };

    // bind to arbitrary context
    Application.prototype.bindKeysToContext = function(context, keys, fn)
    {
        this.keyManager.addKey(keys, context, fn);
    };

    // set the current keys context
    Application.prototype.setKeysContext = function(c)
    {
        this._keyContext = c;
        log('key context changed to ' + (c.cid || '[no cid]'));
    };

    // general function to determine if a context (activity or app) is
    // active/visible etc
    Application.prototype.isActiveContext = function(context)
    {
        if (context === this)
            return true;

        if (this._keyContext)
            return this._keyContext === context;

        return false;
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

    // built-in activites
    Application.prototype.manifestSystemActivities = function()
    {
        this.activityManager.manifestActivity({
            Activity: require('./activities/About'),
            name: 'About Robo',
            hotkey: SYS_CHORD + 'i',
            baseUrl: 'about-robo',
            url: /^about-robo$/
        });

        this.activityManager.manifestActivity({
            Activity: require('./activities/TypeDemo'),
            name: 'Robo Typography Demo',
            hotkey: SYS_CHORD + 't',
            baseUrl: 'typography-robo',
            url: /^typography-robo$/
        });

        this.activityManager.manifestActivity({
            Activity: require('./activities/UglyDemo'),
            name: 'Robo Ugly Demo',
            hotkey: SYS_CHORD + 'u',
            baseUrl: 'ugly-robo',
            url: /^ugly-robo$/
        });

    };

    // instantiation
    Application.prototype.onCreate = function() {};

    // after we've setup, before we start routing
    Application.prototype.onStart = function() {};

    // after we've started routing
    Application.prototype.onResume = function() {};

    // gets the current user logged into the app, should be handled else where
    Application.prototype.getUserId = function() { };

    return Application;
});
