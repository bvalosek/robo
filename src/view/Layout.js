define(function(require) {

    var compose      = require('compose');
    var WithTemplate = require('robo/view/WithTemplate');
    var UiElement    = require('robo/view/UiElement');

    return compose.class('Layout')
        .extends(UiElement)
        .uses(WithTemplate).define({

        __virtual__template: '',

        __fluent__setDataContext: function(context)
        {
            this.dataContext = context;

            // Do all bindings
            _(this.element.querySelectorAll('[data-robo-binding]')).each(function(element) {
                var bindings = element.getAttribute('data-robo-binding');
            });

            return this;
        }

    });

});
