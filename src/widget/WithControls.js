define(function(require) {

    var compose = require('compose');
    var RJson   = require('robo/util/RJson');

    return compose.mixin('WithControls').define({

        // Given a node that has a control widget, instantiate the control and
        // render
        process: function(element)
        {
            var controlModule  = element.getAttribute('data-robo-control');
            var controlOptions = element.getAttribute('data-robo-options');

            var opts = controlOptions ? RJson.parse(controlOptions) : {};

            // hope it has been loaded properly first
            var Ctor = require(controlModule.replace(/\./g, '/'));

            controlOptions         = opts;

            var v = new Ctor(controlOptions).setElement(element);
            v.render();
        },

        processAll: function()
        {
            var controls = this.element.querySelectorAll('[data-robo-control]');
            for (var i = 0; i < controls.length; i++)
                this.process(controls[i]);

        },

        // take over the render function make sure it is only called once, and
        // then render the controls after every seperate call
        __wrapped__render: function(render)
        {
            if (!this._rendered) {
                this._rendered = true;
                render.call(this);
                this.processAll();
            }
        },

    });

});
