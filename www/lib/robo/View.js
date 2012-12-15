define(function(require) {

    var Backbone            = require('backbone');
    var $                   = require('jquery');

    var View = Backbone.View.extend();

    View.prototype.onResume = function()
    {

    };

    View.prototype.print = function(s)
    {
        this.$el.append(s);
    };

    return View;
});
