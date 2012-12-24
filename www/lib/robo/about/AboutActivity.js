define(function(require) {

    var Activity     = require('../Activity');
    var TemplateView = require('../TemplateView');

    require('less!./about.less');

    var About = Activity.extend({
        events: {
            'click .back' : 'close'
        }
    });

    About.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        this.setView(new TemplateView({
            className: 'robo-about-view',
            html: require('text!./about.html')
        }));
    };

    return About;
});
