define(function(require) {

    var Activity     = require('lib/robo/Activity');
    var Application  = require('lib/robo/Application');
    var TemplateView = require('lib/robo/TemplateView');

    var HelloActivity = Activity.extend({
        events: {
            'click .close' : 'close'
        }
    });

    // manifest info to app
    Application.manifestActivity({
        Activity: HelloActivity,
        name: 'Hello World',
    });

    // when Activity is loaded
    HelloActivity.prototype.onStart = function()
    {
        this.constructor.__super__.onStart.call(this);

        // inflate the view
        this.setView(new TemplateView({
            template: 'html/hello'
        }));
    };

    return HelloActivity;
});
