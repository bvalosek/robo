define(function(require, exports, module) {

    var Base           = require('./Base');
    var View           = require('./View');
    var asCompositable = require('./mixins/asCompositable');
    var withEvents     = require('./mixins/withEvents');
    var Backbone       = require('backbone');

    var Application = Base.extend(function() {
        this.onCreate();

        this.window = new View()
            .setElement('body')
            .mixin(asCompositable);

        var d = this.onStart();

        // how we resume
        var postStart = function() {
            this.onResume();

            // set that glob
            window.theApp = this;
        }.bind(this);

        // if application is still starting
        if (d && d.then)
            d.then(postStart);
        else
            postStart();
    });

    // proxy events to the window renderable
    Application.prototype.on = function(eventName, fn, context)
    {

        var f = fn.bind(context || this);
        return this.window.on(eventName, function() {
            f(arguments[1]);
        });
    };

    // clobber trigger and pipe events via dom
    Application.prototype.trigger = function()
    {
        return this.window.trigger.apply(this.window.trigger, arguments);
    };

    // will start routing immediately based on current URL
    Application.prototype.startRouter = function(RouterClass)
    {
        this.router = new RouterClass(this);
        Backbone.history.start({ pushState: true });
    };

    // add a view to the overall DOM and add a class so we can alter the other
    // parts of the screen
    Application.prototype.addPopup = function(view)
    {
        var cName = view.getClassName() + '-open';

        this.window.addView(view);
        this.window.addClass(cName);

        // remove the popup flag when it closes
        view.on('close', function() {
            this.window.removeClass(cName);
        }.bind(this));
    };

    // lifecycle
    Application.prototype.onCreate = function() {};
    Application.prototype.onStart  = function() {};
    Application.prototype.onResume = function() {};

    return Application;
});
