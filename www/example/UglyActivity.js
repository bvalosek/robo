define(function(require) {

    var Activity = require('robo/Activity');

    var _        = require('underscore');

    var Ugly = Activity.extend();

    Ugly.prototype.onStart = function()
    {
        this.print('Hello, World!');
        setTimeout(_(this.close).bind(this), 1000);
    };

    return Ugly;
});
