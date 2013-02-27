define(function(require, exports, module) {

    var Base           = require('./Base');
    var View           = require('./View');
    var asCompositable = require('./mixins/asCompositable');
    var withEvents     = require('./mixins/withEvents');
    var Backbone       = require('backbone');
    var log            = require('./log');

    // singleton context
    var _context;

    var Application = Base.mixin(withEvents).extend({

        constructor: function() {
            if (_context)
                throw new Error('Can only instantiate one Application object');

            log('app booted');

            // stash context
            _context = this;

            this.onCreate();
            log('app created');

            this.window = new View()
                .setElement('body')
                .mixin(asCompositable);

            log('app starting...');
            var d = this.onStart();

            // how we resume
            var postStart = function() {
                log('app done starting');
                this.onResume();
            }.bind(this);

            // if application is still starting
            if (d && d.then)
                d.then(postStart);
            else
                postStart();
        },

        // will start routing immediately based on current URL
        startRouter: function(RouterClass)
        {
            this.router = new RouterClass(this);
            Backbone.history.start({ pushState: true });
        },

        // add a view to the overall DOM and add a class so we can alter the other
        // parts of the screen
        addPopup: function(view)
        {
            var cName = view.getClassName() + '-open';

            this.window.addView(view);
            this.window.addClass(cName);

            // remove the popup flag when it closes
            view.on('close', function() {
                this.window.removeClass(cName);
            }.bind(this));
        },

        // lifecycle defaults-- should override
        onCreate : function() {},
        onStart  : function() {},
        onResume : function() {}
    });

    Application.instance = function()
    {
        return _context;
    };

    return Application;
});
