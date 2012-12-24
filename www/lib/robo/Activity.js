define(function(require) {

    var _    = require('underscore');

    var View = require('./LazyView');
    var log  = require('./log');

    require('less!./res/activity.less');

    var Activity = View.extend({
        className: 'activity'
    });

    // override close behavior
    Activity.prototype.close = function()
    {
        this.onPause();

        this._clearTimers();
        this.unbindKeys();

        this.onStop();

        // close the actual view
        View.prototype.close.call(this);

        this.onDestroy();
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

        var tId = setInterval(_(fn).bind(context), t);

        this.log('starting timer ' + tId);

        this._timers.push(tId);
    };

    // do it once and then set the interval
    Activity.prototype.doInterval = function(fn, t, context)
    {
        fn.call(context || this);
        this.setInterval(fn, t, context);
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
    }

    // On instantiation
    Activity.prototype.onCreate = function() {
        this.log('onCreate');
        this.created = true;

    };

    // After creation, when the DOM is setup
    Activity.prototype.onStart = function()
    {
        this.log('onStart');

        this.bindKeys('ctrl-i', function() {
            this.log('KEYS!');
        });

        if (!this.created)
            throw new Error('onCreate not called for Activity');
    };

    // called everytime when brought to foreground
    Activity.prototype.onResume = function()
    {
        this.log('onResume');

        this.$el.removeClass('activity-pause');
    };

    // when we lose focus
    Activity.prototype.onPause = function()
    {
        this.log('onPause');

        this.$el.addClass('activity-pause');
    };

    // right before the view is removed
    Activity.prototype.onStop = function()
    {
        this.log('onStop');
    };

    // after the view is gone and before we're done
    Activity.prototype.onDestroy = function()
    {
        this.log('onDestroy');
    };

    Activity.prototype.log = function(s)
    {
        log(this.manifest.name + '[' + this.cid + ']:' + s);
    };

    return Activity;
});
