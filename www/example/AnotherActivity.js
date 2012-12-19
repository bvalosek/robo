define(function(require) {

    var Application = require('lib/robo/Application');

    var HelloView   = require('./HelloView');
    var Activity    = require('./BaseActivity');

    var AnotherActivity = Activity.extend();

    AnotherActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        // inflate view
        this.setView(new HelloView({ title: 'Another One' }));
    };

    return AnotherActivity;

});
