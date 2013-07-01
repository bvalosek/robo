define(function(require) {

    var compose         = require('compose');
    var WithTemplate    = require('robo/view/WithTemplate');
    var View            = require('robo/view/View');

    return compose.class('TemplateView')
        .extends(View)
        .uses(WithTemplate).define({

        __virtual__template: ''

    });

});
