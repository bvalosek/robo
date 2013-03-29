define(function(require, exports, module) {

    var helpers = require('../helpers');
    var _       = require('underscore');
    var $       = require('jquery');
    var compose = require('compose');

    // give a view the ability to create controls that are then handled via
    // onContolChange calls
    var withControls = compose.defineMixin(
    {
        __name__: 'withControls',

        // take over the render function make sure it is only called once, and
        // then render the controls after every seperate call
        __wrapped__render: function(render)
        {
            if (this._closed)
                throw new Error('Attempting to render a View withControls after it has been closed');

            if (!this._rendered) {
                this._rendered = true;
                return render();
            }

            this.controls = this.control || [];

            this.controls.forEach(function(control) {
                control.render();
            });
        },

        // make sure to remove rendered flag on close
        __before__close: function()
        {
            this._close = true;
        },

        controlFactory: function(View, opts)
        {
            // apply all the arguments to the constructor, give the control a
            // reference to the parent, and stash a reference to the control
            opts = opts || {};
            opts.parentView = this;
            var v = new View(opts);
            this[opts.id || v.cid] = v;

            // add to control list if parent wants it
            this.controls = this.controls || [];
            this.controls.push(v);

            // make sure to close thew new v when this view closes
            this.on('close', v.close.bind(v));

            // and remove this shit from parent when it closes
            this.listenTo(v, 'close', function() {
                this.controls = _(this.controls).without(v);
            });

            // a bit later bind the actual dom element to the HTML we
            // insterted. This is actually pretty expensive and also relies on
            // the assumption that the DOM will be ready as soon as the calling
            // stack frame has cleared.
            _(function() {
                var $target = this.$('[data-cid="' + v.cid + '"]');
                v.setElement($target);
                v.render();
            }.bind(this)).defer();

            // return placeholder text to insert
            return  v.$el.attr('data-cid', v.cid).prop('outerHTML');
        }

    });

    return withControls;
});
