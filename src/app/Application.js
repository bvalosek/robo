define(function(require, exports, module) {

    var $          = require('jquery');
    var compose    = require('compose');
    var withEvents = require('../event/withEvents');
    var ViewGroup  = require('../view/ViewGroup');

    var Application = compose.using(withEvents).defineClass({

        __constructor__Application: function() {
            if (Application.context)
                throw new Error('Can only instantiate one Application object');

            // stash context
            Application.context = this;
        },

        // called by the web page to boot the application
        start: function()
        {
            $(function() {
                this.window = new ViewGroup();
                this.window.setElement('body');

                this.onStart();
            }.bind(this));
        },

        // singleton style
        __static__context: null,

        __static__get__instance: function()
        {
            return Application.context;
        },

        // after DOM is ready and app has started
        __virtual__onStart  : function() {}
    });

    return Application;
});
