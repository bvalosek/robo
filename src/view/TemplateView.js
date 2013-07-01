define(function(require) {

    var compose      = require('compose');
    var WithTemplate = require('robo/view/WithTemplate');
    var View         = require('robo/view/View');

    return compose.class('TemplateView')
        .extends(View)
        .uses(WithTemplate).define({

        __virtual__template: '',

        __fluent__setDataContext: function(context)
        {
            this.dataContext = context;

            // Do all bindings
            _(this.element.querySelectorAll('[data-robo-binding]')).each(function(element) {
                var bindings = element.getAttribute('data-robo-binding');

                // Parse out info
                var info;
                with(this) { eval('info = ' + bindings); }

                _(info).each(function(target, source) {
                    console.log('Binding', source, 'to', target);
                });
            });

            return this;
        }

    });

});
