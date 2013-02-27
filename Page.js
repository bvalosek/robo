define(function(require, exports, module) {

    var View             = require('./View');
    var AnimationContext = require('./AnimationContext');
    var $                = require('jquery');
    var _                = require('underscore');

    var Page = View.extend({

        constructor: function()
        {
            Page.Super.call(this);

            // keep track of a single animation context
            this.animationContext = new AnimationContext();

            // when dom loads, try to find a dump and chumped data
            $(function() {

                // defer until the call stack is empty to make sure whatever is
                // creating us can finish
                _(function() {
                    if (window.page)
                        this.data = window.page;

                    // base view
                    this.setElement($('.content div').first());

                    // start the page with any dump n chump
                    this.onStart(this.data);

                }.bind(this)).defer();

            }.bind(this));
        },

        setTitle: function(s)
        {
            document.title = s;
        },

        // create a view-like object with the animation context pre-set
        viewFactory: function(Renderable)
        {
            var v = new Renderable();
            v.animationContext = this.animationContext;
            return v;
        },

        // called once page has loaded
        onStart: function() {}

    });

    return Page;
});
