define(function(require, exports, module) {

    var Base           = require('./Base');
    var View           = require('./View');
    var asCompositable = require('./mixins/asCompositable');
    var withEvents     = require('./mixins/withEvents');
    var Backbone       = require('backbone');
    var log            = require('./log');
    var _              = require('underscore');

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
        // parts of the screen. Also default to only 1 per type. Optionally
        // context will close the popup when the context closes
        addPopup: function(view, context)
        {
            this._popupClasses = this._popupClasses || [];

            var cName = view.getClassName() + '-open';

            if (~this._popupClasses.indexOf(cName)) {
                log('Only 1 type of this popup allowed at once');
                return;
            }

            this._popupClasses.push(cName);
            this.window.addView(view);
            this.window.addClass(cName);

            // close the popup if the context closes
            if (context && context.close && context.on) {
                this.listenTo(context, events.CLOSE, view.close.bind(view));
            }

            // remove the popup flag when it closes and clear the
            view.on('close', function() {
                this.window.removeClass(cName);
                this._popupClasses = _(this._popupClasses).without(cName);
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
