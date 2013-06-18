define(function(require) {

    var compose = require('compose');
    var Parser  = require('robo/util/Parser');

    return compose.mixin('WithControls').define({

        // Given a node that has a control widget, instantiate the control and
        // render
        process: function(element)
        {
            var mod      = element.getAttribute('data-robo-control');
            var options  = element.getAttribute('data-robo-options');
            var bindings = element.getAttribute('data-robo-binding');

            // hope it has been loaded properly first
            var Ctor = require(mod.replace(/\./g, '/'));

            // parse out bindings
            var binds = Parser.parseOptions(bindings);

            _(binds).each(function(target, key) {
                console.log('binding', key, 'to', target);
            });

            // create and render
            var v = new Ctor().setElement(element);
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
