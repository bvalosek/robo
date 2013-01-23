define(function(require) {

    var DeferredView = require('./DeferredView');

    var Control = DeferredView.extend({
        className: 'control',

    });

    Control.prototype.initialize = function(opts)
    {
        opts = opts || {};
        this.$el.attr('data-control-name', opts.controlName || this.cid);
        console.log(this.cid);
    }


    return Control;
});
