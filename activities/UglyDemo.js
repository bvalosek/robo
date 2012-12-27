define(function(require) {
    var Activity     = require('../Activity');

    var Ugly = Activity.extend();

    Ugly.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        this.print('Hello, World!');
    };

    return Ugly;
});
