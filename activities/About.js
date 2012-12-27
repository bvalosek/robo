define(function(require) {

    var Activity     = require('../Activity');
    var TemplateView = require('../TemplateView');

    // style
    require('less!./about.less');

    // setup events
    var About = Activity.extend({
        className: 'robo-about-activity'
    });

    // inflate view
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
