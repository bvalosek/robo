define(function(require) {

    var Activity     = require('../Activity');
    var TemplateView = require('../TemplateView');

    require('less!./about.less');

    var About = Activity.extend();

    About.prototype.onStart = function()
    {
        this.setView(new TemplateView({
            className: 'robo-about-view',
            html: require('text!./about.html')
        }));
    };

    return About;
});
