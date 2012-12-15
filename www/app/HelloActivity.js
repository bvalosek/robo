define(function(require) {

    var Activity = require('lib/robo/Activity');
    var theApp   = require('app/MyApp');

    var HelloActivity = Activity.extend();

    // manifest info to app
    theApp.manifestActivity({
        Activity: HelloActivity
    });

    return HelloActivity;
});
