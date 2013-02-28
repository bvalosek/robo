define(function(require, exports, module) {

    var TemplateView      = require('./TemplateView');
    var withDeferredClose = require('./mixins/withDeferredClose');
    var events            = require('events');
    var $                 = require('jquery');

    var Popup = TemplateView.mixin(withDeferredClose).extend({

        constructor: function()
        {
            Popup.Super.call(this);

            this.value = undefined;
            this._d = new $.Deferred();
            this.delegate('.close-popup', events.CLICK, this.close);
        },

        // should be override, when the popup is done and we have some value
        setValue: function(val)
        {
            this.value = val;
            return this;
        },

        // kill the popup
        cancel: function()
        {
            this.value = null;
            this.close();
        },

        close: function()
        {
            if (this.value !== undefined)
                this._d.resolve(this.value);
            else
                this._d.reject();

            Popup.Super.prototype.close.call(this);
        },

        // the deferred we can either have pass or fail
        when: function()
        {
            return this._d;
        }

    });

    return Popup;
});
