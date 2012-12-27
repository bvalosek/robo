define(function(require) {
    var Activity     = require('../Activity');
    var TemplateView = require('../TemplateView');

    // style
    require('less!./type-demo.less');

    // setup events
    var TypeDemo = Activity.extend({
        className: 'robo-type-demo-activity'
    });

    // inflate view
    TypeDemo.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        this.setView(new TemplateView({
            className: 'robo-lorem-view',
            html: require('text!./lorem.html')
        }));
    };

    return TypeDemo;
});
