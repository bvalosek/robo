define(function(require) {

    var compose         = require('compose');
    var WithTemplate    = require('robo/view/WithTemplate');
    var WithControls    = require('robo/widget/WithControls');
    var View            = require('robo/view/View');
    var WithViewLogging = require('robo/util/WithViewLogging');

    return compose.class('TemplateView')
        .extends(View)
        .uses(WithTemplate, WithControls, WithViewLogging).define({

        __virtual__template: ''

    });

});
