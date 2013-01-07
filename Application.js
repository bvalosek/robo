define(function(require) {

    var Backbone        = require('backbone');
    var $               = require('jquery');
    var _               = require('underscore');

    var View            = require('./View');
    var log             = require('./log');
    var Base            = require('./Base');
    var ActivityManager = require('./ActivityManager');
    var KeyManager      = require('./KeyManager');

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

        // shortcut keys
        this.keyManager = new KeyManager(this);

        // setup history and routes
        this.activityManager = new ActivityManager(this);

        // setup trigger for resize
        var self = this;
        $(window).resize(_.debounce(function() {
            self._resizing = false;
            self.trigger(Application.ON.RESIZE);
        }, 500));

        $(window).resize(_.throttle(function() {
            if (self._resizing)
                return;

            self._resizing = true;
            self.trigger(Application.ON.RESIZE_START);
        }, 500));

        // get the party started when we're done
        var d = this.onStart();
        var doStart = _(function() {
            log('application loaded');
            this.window.$el.html('');
            this.activityManager.startRouting();
            this.onResume();
            this.watchIdle();
            log('application started');
        }).bind(this);

        if (d && d.done) {
            log('waiting for application to finish loading...');
            d.done(doStart);
        } else
            doStart();

    });

    // stash the instance
    Application.getInstance = function()
    {
        return _instance;
    };

    // events
    Application.ON = {
        RESIZE: 'application:resize',
        RESIZE_START: 'application:resize-start',
        LOGIN: 'application:login',
        IDLE_START: 'application:idle-start',
        IDLE_END: 'application:idle-end'
    };

    Application.prototype.watchIdle = function()
    {
        this._isIdle   = false;
        this._idleTime = 0;

        // reset idle timer everytime the mouse moves
        $(window).mousemove(_(function() {
            this._idleTime = 0;

            if (this._isIdle) {
                this._isIdle = false;
                this.stopIdle();
            }

        }).bind(this));

        // increment idle timer every second
        setInterval(_(function() {
            if (this._resizing)
                return;

            this._idleTime++;

            if (this._idleTime == 5) {
                this._isIdle = true;
                this.startIdle();
            }
        }).bind(this), 1000);
    };

    Application.prototype.stopIdle = function()
    {
        log('app is no longer idle');
        var a = this.activityManager.getTopActivity();
        if (a) a.onIdleStop();
    };

    Application.prototype.startIdle = function()
    {
        log('app is now idle');
        var a = this.activityManager.getTopActivity();
        if (a) a.onIdleStart();
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
