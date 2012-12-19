define(function(require) {

    var Activity     = require('lib/robo/Activity');
    var TemplateView = require('lib/robo/TemplateView');

    // styles
    require('less!./res/activity');

    var BaseActivity = Activity.extend({
        html      : require('text!./res/activity.html'),
        className : 'base-activity'
    });

    BaseActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        // switch over to using content for adding views
        this.setContainerViewByElement(this.$('.content'));
    };

    return BaseActivity;
});
