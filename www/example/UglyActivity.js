define(function(require) {
    var Activity = require('lib/robo/Activity');

    var UglyActivity = Activity.extend();

    UglyActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);
        this.print('Hello, World!');
    };

    return UglyActivity;
});
