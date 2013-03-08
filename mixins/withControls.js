define(function(require, exports, module) {

    var helpers = require('../helpers');
    var log     = require('../log');
    var _       = require('underscore');
    var $       = require('jquery');

    // give a view the ability to create controls that are then handled via
    // onContolChange calls
    var withControls = function()
    {
        this.controlFactory = function(View, tag)
        {
            // apply all the arguments to the constructor, give the control a
            // reference to the parent, and stash a reference to the control
            var args = _(arguments).toArray();
            args.splice(1, 1);
            var v =  helpers.applyToConstructor.apply(this, args);

            if (tag) {
                this.controls = this.controls || {};
                this.controls[tag] = v;

                var f = tag + 'OnStart';
                if (this[f])
                    this[f](v);
            }

            // make sure to close thew new v when this view closes
            this.on('close', v.close.bind(v));

            // a bit later bind the actual dom element to the HTML we insterted
            _(function() {
                var classes = v.$el.attr('class');
                v.setElement(this.$('[data-cid="' + v.cid + '"]')).render();
                v.setClass(classes);
            }.bind(this)).defer();

            // return placeholder text to insert
            return  $('<div>').attr('data-cid', v.cid).prop('outerHTML');
        };
    };

    return withControls;
});
