define(function(require) {

    var TemplateView = require('./TemplateView');
    var log          = require('./log');

    var Activity = TemplateView.extend({
        className: 'activity'
    });

    // override close behavior
    Activity.prototype.close = function()
    {
        this.onPause();
        this.onStart();

        // close the actual view
        this.constructor.__super__.close.call(this);

        this.onDestroy();
    }


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
