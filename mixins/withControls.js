define(function(require, exports, module) {

    var helpers = require('../helpers');
    var log     = require('../log');
    var _       = require('underscore');
    var $       = require('jquery');

    // give a view the ability to create controls that are then handled via
    // onContolChange calls
    var withControls = function()
    {
        this.controlFactory = function(View, opts)
        {
            // apply all the arguments to the constructor, give the control a
            // reference to the parent, and stash a reference to the control
            opts = opts || {};
            opts.parentView = this;
            var v = new View(opts);

            // make sure to close thew new v when this view closes
            this.on('close', v.close.bind(v));

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
                log('swapped in control ' + v.cid);
                $target.after($new).remove();
                v.setElement($new).render();

            }.bind(this)).defer();

            // return placeholder text to insert
            return  $('<div>').attr('data-cid', v.cid).prop('outerHTML');
        };
    };

    return withControls;
});
