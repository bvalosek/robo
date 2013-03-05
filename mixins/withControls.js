define(function(require, exports, module) {

    var helpers = require('../helpers');
    var log     = require('../log');
    var _       = require('underscore');
    var $       = require('jquery');

    // give a view the ability to create controls that are then handled via
    // onContolChange calls
    var withControls = function()
    {
        this.controlFactory = function(View)
        {
            // apply all the arguments to the constructor
            var v =  helpers.applyToConstructor.apply(this, arguments);
            v.parent = this;

            // make sure to close thew new v when this view closes
            this.on('close', v.close.bind(v));

            // a bit later bind the actual dom element to the HTML we insterted
            _(function() {
                v.setElement(this.$('[data-cid="' + v.cid + '"]')).render();
            }.bind(this)).defer();

            // return placeholder text to insert
            return  $('<div>').attr('data-cid', v.cid).prop('outerHTML');
        };

        // should be overridden to do something interesting with the control
        this.onControlChange = function(control)
        {
            log('control ' + control.cid + ' has changed but is not handled');
        };
    };

    return withControls;
});
