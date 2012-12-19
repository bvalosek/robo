define(function(require) {

    var TemplateView = require('lib/robo/TemplateView');
    var Application  = require('lib/robo/Application');

    // styles
    require('less!./res/hello.less');

    var HelloView = TemplateView.extend({
        html: require('text!./res/hello.html'),
        className: 'hello-view',
        events: {
            'click .hello'   : 'goToHello',
            'click .another' : 'goToAnother',
        }
    });

    HelloView.prototype.goToHello = function()
    {
        Application.getInstance().startActivity(
            Application.getActivities().ExampleActivity);
    };

    HelloView.prototype.goToAnother = function()
    {
        Application.getInstance().startActivity(
            Application.getActivities().AnotherActivity);
    };

    return HelloView;
});
