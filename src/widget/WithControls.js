define(function(require) {

    var compose       = require('compose');
    var Parser        = require('robo/util/Parser');
    var RoboException = require('robo/util/RoboException');

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

            // create and render
            var v = new Ctor().setElement(element);
            v.render();

            // parse out bindings and link everything up
            var binds = Parser.parseOptions(bindings);
            var _this = this;
            _(binds).each(function(target, key) {
                _this._handleBind(target, key, v);
            });

        },

        // Key is what is in the DOM, target is our this member
        _handleBind: function(target, key, view)
        {
            console.log('binding', key, 'to', target);
            var _this = this;

            switch (key)
            {
                case 'click':
                    f = this[target].bind(this);
                    this.listenTo(view, 'click', f);
                    break;

                // must be observable data
                default:
                    // ensure that the key is observable
                    if (!this.constructor.__annotations__[target].OBSERVABLE)
                        throw new RoboException('Cannot bind to non-observable member');

                    view[key] = _this[target];

                    this.on('change:' + target, function() {
                        view[key] = _this[target];
                    });

                    view.on('change:' + key, function() {
                        _this[target] = view[key];
                    });
            }

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
            } else {
            }
        },

    });

});
