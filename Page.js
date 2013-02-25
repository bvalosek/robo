define(function(require, exports, module) {

    var Base             = require('./Base');
    var View             = require('./View');
    var AnimationContext = require('./AnimationContext');
    var $                = require('jquery');
    var withEvents       = require('./mixins/withEvents');
    var _                = require('underscore');

    var Page = Base.extend(function()
    {
        this.onCreate();

        this.animationContext = new AnimationContext();

        // when dom loads, try to find a dump and chumped data
        $(function() {

            // defer until the call stack is empty to make sure whatever is
            // creating us can finish
            _(function() {
                if (window.page)
                    this.data = window.page;

                // base view
                this.root = new View().setElement($('.content div').first());

                this.onStart(this.data);
            }.bind(this)).defer();

        }.bind(this));
    }).mixin(withEvents);

    Page.prototype.setTitle = function(s)
    {
        document.title = s;
    };

    // pre-populate with animation context
    Page.prototype.animationFactory = function(Renderable)
    {
        var v = new Renderable();
        v.animationContext = this.animationContext;
        return v;
    };

    // delegate an event to the root View and bind the callback to the correct
    // context
    Page.prototype.delegate = function(selector, eventName, method)
    {
        return this.root.delegate(selector, eventName, method, this);
    };

    // convenient access to the page root
    Page.prototype.$ = function()
    {
        return this.root.$.apply(this.root, arguments);
    };

    Page.prototype.onCreate = function() {};
    Page.prototype.onStart = function() {};

    return Page;
});
