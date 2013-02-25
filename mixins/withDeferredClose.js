define(function(require, exports, module) {

    var compose = require('robo/compose');
    var _       = require('underscore');

    // modify the render and close behavior to delay the removal from the DOM
    // long enough to potentially animate it
    var withDeferredClose =  function()
    {
        // once we render, add the opened class
        this.render = compose.wrap(this.render, function(render) {
            _(function() {
                this.addClass('open').addClass('opened');
            }.bind(this)).defer();

            return render();
        });

        // close after a short period of time
        this.close = compose.wrap(this.close, function(close) {
            this.addClass('closed').removeClass('open');
            this.trigger('close');

            setTimeout(function() {
                close({silent: true });
            }, 1000);

            return this;
        });
    };

    return withDeferredClose;

});
