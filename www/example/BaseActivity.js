define(function(require) {

    var Activity     = require('robo/Activity');
    var TemplateView = require('robo/TemplateView');
    var Geometry     = require('robo/Geometry');

    // styles
    require('less!./res/base-activity');

    var BaseActivity = Activity.extend({
        // className : 'base-activity reactive-geometry',
        className : 'base-activity',
        html      : require('text!./res/base-activity.html')
    });

    BaseActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        // reactive geometry
        // new Geometry({$w: this.$el }).updateBaseSize();

        // switch over to using content for adding views
        this.setContainerViewByElement(this.$('.content'));
    };

    return BaseActivity;
});
