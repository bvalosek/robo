define(function(require) {

    var Application = require('lib/robo/Application');

    var HelloView   = require('./HelloView');
    var Activity    = require('./BaseActivity');

    var ExampleActivity = Activity.extend();

    ExampleActivity.prototype.onStart = function()
    {
        Activity.prototype.onStart.call(this);

        // inflate view
        this.setView(new HelloView({ title: 'Example Activity' }));
    };

    return ExampleActivity;
});
