define(function(require) {

    var Application = require('robo/Application');
    var Geometry    = require('robo/Geometry');

    var SampleApplication = Application.extend();

    // main function
    SampleApplication.prototype.onCreate = function()
    {
        // restart admin if everything is closed
        var self = this;
        this.bind(Application.ON.WINDOW_EMPTY, function() {
            self.startActivity(Application.getActivities().ExampleActivity);
        });

        // setup geometry
        this.bind(Application.ON.RESIZE, function() {
            Geometry.updateAllSizes('.reactive-geometry');
        });
    };

    return SampleApplication;
});
