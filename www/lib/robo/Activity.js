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

    // Called once when about to resume
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

    // when stopping
    Activity.prototype.onStop = function() {
        log('onStop');
    };

    // right before deleted
    Activity.prototype.onDestroy = function() {
        log('onDestroy');
    };

    return Activity;
});
