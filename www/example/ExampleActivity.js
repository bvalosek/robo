define(function(require) {

    var Application  = require('robo/Application');
    var TemplateView = require('robo/TemplateView');

    var Activity     = require('./BaseActivity');

    var ExampleActivity = Activity.extend({
        events: {
            'click .close' : 'close',
            'click .ugly'  : 'showUgly',
            'click .push'  : 'showAnother'
        }
    });

    ExampleActivity.prototype.showUgly = function()
    {
        Application.getInstance().startActivity(Application.getActivities().UglyActivity);
    };

    ExampleActivity.prototype.showAnother = function()
    {
        Application.getInstance().startActivity(Application.getActivities().ExampleActivity);
    };

    ExampleActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        this.setView(new TemplateView({
            html: require('text!./res/example-activity.html')
        }));
    };

    return ExampleActivity;
});
