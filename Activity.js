define(function(require) {

    var _            = require('underscore');
    var View         = require('./View');
    var DeferredView = require('./DeferredView');
    var log          = require('./log');
    var Geometry     = require('./Geometry');

    // stylez
    require('less!./res/activity.less');

    var Activity = DeferredView.extend({
        className: 'robo-activity'
    });

    Activity.extend = function(opts)
    {
        // append classname instead of overwriting
        if (opts && opts.className)
            opts.className = 'robo-activity ' + opts.className;

        return DeferredView.extend.call(this, opts);
    };

    Activity.ON = {
        CREATE: 'robo-activity:create',
        START: 'robo-activity:start',
        RESUME: 'robo-activity:resume',
        PAUSE: 'robo-activity:pause',
        STOP: 'robo-activity:stop',
        DESTROY: 'robo-activity:destroy'
    };

    // override close behavior
    Activity.prototype.close = function()
    {
        if (this.currentState != Activity.ON.PAUSE)
            this.onPause();

        this._clearTimers();
        this.unbindKeys();
        this.context.off(null, null, this);

        this.onStop();

        // close the actual view
        DeferredView.prototype.close.call(this);

        this.onDestroy();
        this.currentState = Activity.ON.DEAD;
    };

    // stop all proxy timers
    Activity.prototype._clearTimers = function()
    {
        var self = this;
        _(this._timers).each(function(t) {
            self.log('stopping timer ' + t);
            clearInterval(t);
        });
    };

    // proxy the timer management
    Activity.prototype.setInterval = function(fn, t, context)
    {
        this._timers = this._timers || [];
        context = context || this;

        var tId = setInterval(fn.bind(context), t);

        this.log('starting timer ' + tId);

        this._timers.push(tId);
    };

    // do it once and then set the interval
    Activity.prototype.doInterval = function(fn, t, context)
    {
        fn.call(context || this);
        this.setInterval(fn, t, context);
    };

    Activity.prototype.claimKeyFocus = function()
    {
        this.context.setKeysContext(this);
    };

    // a function called when this activiy is active, cleaned up auto on close,
    // and called in the context of activity
    Activity.prototype.bindKeys = function(keys, fn)
    {
        this.context.keyManager.addKey(keys, this, fn);
    };

    Activity.prototype.unbindKeys = function()
    {
        this.context.keyManager.clearKeys(this);
    };

    // create a view on the root element, steal key focus
    Activity.prototype.appendExternalView = function(view)
    {
        view.listenTo(this, View.ON.HIDE, view.close);

        this.$el.addClass(view.className + '-showing');


        this.listenTo(view, View.ON.HIDE, function() {
            this.$el.removeClass(view.className + '-showing');
            this.claimKeyFocus();
        });

        this.context.bindKeysToContext(view, 'esc', view.close);
        this.context.setKeysContext(view);

        return this.context.window.appendView(view);
    };

    // trigger event etc
    Activity.prototype.setState = function(state, stateChecks)
    {
        this.log(state);
        this.trigger(state);

        if (stateChecks) {
            var curState = this.currentState;
            var validChange = _(stateChecks).any(function(x) { return x === curState; });
            if (!validChange)
                throw new Error('Invalid activity state change: ' + state);
        }

        this.currentState = state;
    };

    // On instantiation
    Activity.prototype.onCreate = function() {
        this.setState(Activity.ON.CREATE);
    };

    // After creation, when the DOM is setup
    Activity.prototype.onStart = function()
    {
        this.setState(Activity.ON.START, [Activity.ON.CREATE]);

        this.bindKeys('esc', this.close);
    };

    // called everytime when brought to foreground
    Activity.prototype.onResume = function()
    {
        this.setState(Activity.ON.RESUME, [Activity.ON.START, Activity.ON.PAUSE]);
        this.onIdleStop();

        this.$el.removeClass('activity-pause');

        this.context.setKeysContext(this);

        Geometry.updateActivity(this);
    };

    // when we lose focus
    Activity.prototype.onPause = function()
    {
        this.setState(Activity.ON.PAUSE, [Activity.ON.RESUME, Activity.ON.PAUSE]);

        this.$el.addClass('activity-pause');
    };

    // right before the view is removed
    Activity.prototype.onStop = function()
    {
        this.setState(Activity.ON.STOP, [Activity.ON.PAUSE]);
    };

    // after the view is gone and before we're done
    Activity.prototype.onDestroy = function()
    {
        this.setState(Activity.ON.DESTROY, [Activity.ON.STOP]);
    };

    // find any views in the DOM we've already setup
    Activity.prototype.bindStaticViews = function()
    {
        // find all views and pre-setup
        var activity = this;
        this.$('[data-robo-view]').each(function() {
            var $el = $(this);
            var name = $el.data('robo-view');

            activity.log('adding static view: ' + name);

            var v = new View({ el: $el });
            activity.addChild(v);
            activity[name] = v;
        });
    };


    Activity.prototype.onIdleStop = function()
    {
        this.$el.removeClass('idle');
    };
    Activity.prototype.onIdleStart = function()
    {
        this.$el.addClass('idle');
    };

    Activity.prototype.log = function(s)
    {
        log(this.manifest.name + '[' + this.cid + ']:' + s);
    };

    return Activity;
});
