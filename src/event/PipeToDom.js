define(function(require) {

    var compose = require('compose');

    // Wrap event stuff such that it also listens on the DOM element. Assumes
    // we have the dom element on this.element
    return compose.mixin('PipeToDom').define({

        __after__on: function(name, callback, context)
        {
            if (!this.element) return;
            this.element.addEventListener(name, callback);
        },

        __after__off: function(name, callback, context)
        {
            if (!this.element || !this._events) return;
        }

    });

});
