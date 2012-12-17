define(function(require) {

    var _            = require('underscore');
    var TemplateView = require('./TemplateView');
    var log          = require('./log');

    var Activity = TemplateView.extend({
        className: 'activity'
    });

    // override close behavior
    Activity.prototype.close = function()
    {
        this.onPause();

        this._clearTimers();

        this.onStop();

        // close the actual view
        TemplateView.prototype.close.call(this);

        this.onDestroy();
    };

    // clear out timers
    Activity.prototype._clearTimers = function()
    {
        _(this._timers).each(function(t) {
            log('stopping timer ' + t);
            clearInterval(t);
        });
    };

    // proxy the timer management
    Activity.prototype.setInterval = function(fn, t, context)
    {
        this._timers = this._timers || [];
        context = context || this;

        var tId = setInterval(_(fn).bind(context), t);

        log('starting timer ' + tId);

        this._timers.push(tId);
    };

    // do it once and then set the interval
    Activity.prototype.doInterval = function(fn, t, context)
    {
        fn.call(context || this);
        this.setInterval(fn, t, context);
    };

    // On instantiation
    Activity.prototype.onCreate = function() {
        log('onCreate');
    };

    // After creation, when the DOM is setup
    Activity.prototype.onStart = function() {
        log('onStart');
    };

    // called everytime when brought to foreground
    Activity.prototype.onResume = function() {
        log('onResume');
    };

    // when we lose focus
    Activity.prototype.onPause = function() {
        log('onPause');
    };

    // right before the view is removed
    Activity.prototype.onStop = function() {
        log('onStop');
    };

    // after the view is gone and before we're done
    Activity.prototype.onDestroy = function() {
        log('onDestroy');
    };

    return Activity;
});
