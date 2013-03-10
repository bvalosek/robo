define(function(require, exports, module) {

    var helpers = require('../helpers');
    var _       = require('underscore');
    var $       = require('jquery');
    var compose = require('../compose');

    // give a view the ability to create controls that are then handled via
    // onContolChange calls
    var withControls = function()
    {

        // take over the render function make sure it is only called once, and
        // then render the controls after every seperate call
        this.render = compose.wrap(this.render, function(render)
        {
            if (this._closed)
                throw new Error('Attempting to render a View withControls after it has been closed');

            if (!this._rendered) {
                this._rendered = true;
                return render();
            }

            this.controls.forEach(function(control) {
                control.render();
            });
        });

        // make sure to remove rendered flag on close
        this.close = compose.wrap(this.close, function(close)
        {
            this._close = true;
            return close();
        });

        this.controlFactory = function(View, opts)
        {
            // apply all the arguments to the constructor, give the control a
            // reference to the parent, and stash a reference to the control
            opts = opts || {};
            opts.parentView = this;
            var v = new View(opts);

            // if, when this view is done rending, if all the children should
            // be moved out of the container
            var flatten = opts.flatten;

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
                var tagName = v.$el.prop('tagName');

                var $target = this.$('[data-cid="' + v.cid + '"]');
                var $new = $('<' + tagName + '>');

                // copy over all attributes
                var theOld = v.$el[0];
                $.each(theOld.attributes, function(x) {
                    $new.attr(theOld.attributes[x].name,
                        theOld.attributes[x].value);
                });

                // any additional?
                if (v._attributes)
                    _(v._attributes).each(function(val, key) {
                        $new.attr(key, val);
                    });

                // swap n set
                $target.after($new).remove();
                v.setElement($new).render();

                // move children out of container?
                if (flatten) {
                    var $newParent = v.$el.parent();
                    var $oldParent = v.$el;

                    v.$el.after(v.$el.children());
                    v.setElement($newParent);
                    $oldParent.remove();
                }

            }.bind(this)).defer();

            // return placeholder text to insert
            return  $('<div>').attr('data-cid', v.cid).prop('outerHTML');
        };
    };

    return withControls;
});
