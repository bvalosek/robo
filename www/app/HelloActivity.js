define(function(require) {

    var Activity    = require('lib/robo/Activity');
    var Application = require('lib/robo/Application');

    var HelloActivity = Activity.extend();

    // manifest info to app
    Application.manifestActivity({
        Activity: HelloActivity,
        name: 'Hello World'
    });

    return HelloActivity;
});
