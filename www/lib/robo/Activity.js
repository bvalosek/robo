define(function(require) {

    var TemplateView = require('lib/robo/TemplateView');
    var log = require('lib/robo/log');

    var Activity = TemplateView.extend();

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
